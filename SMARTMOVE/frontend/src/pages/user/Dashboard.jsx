import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Bell,
  FileWarning,
  ParkingSquare,
  Route,
  TrendingUp,
  Navigation,
  BarChart3,
  ShieldAlert,
} from "lucide-react";

import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/common/StatCard";
import MapView from "../../components/maps/MapView";

export default function Dashboard() {
  const { user } = useAuth();

  const [d, setD] = useState({
    journeys: 0,
    reports: 0,
    alerts: 0,
    parkingOptions: 0,
    traffic: [],
    parking: [],
    transport: [],
    issues: [],
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      // Use allSettled (not all) so one failing widget - e.g. issues
      // temporarily unavailable - doesn't blank out the entire dashboard.
      const [
        journeysResult,
        issuesResult,
        notificationsResult,
        parkingResult,
        trafficResult,
        transportResult,
      ] = await Promise.allSettled([
        api.get("/journeys"),
        api.get("/issues/mine"),
        api.get("/notifications"),
        api.get("/parking"),
        api.get("/traffic"),
        api.get("/transport"),
      ]);

      const failedWidgets = [];
      const dataOf = (result, label) => {
        if (result.status === "fulfilled" && Array.isArray(result.value.data)) {
          return result.value.data;
        }
        if (result.status === "rejected") {
          console.error(`Dashboard widget "${label}" failed:`, result.reason);
          failedWidgets.push(label);
        }
        return [];
      };

      const journeys = dataOf(journeysResult, "journeys");
      const issues = dataOf(issuesResult, "issues");
      const notifications = dataOf(notificationsResult, "notifications");
      const parking = dataOf(parkingResult, "parking");
      const traffic = dataOf(trafficResult, "traffic");
      const transport = dataOf(transportResult, "transport");

      const parkingOptions = parking.filter(
        (item) => String(item.status || "").toUpperCase() !== "FULL"
      ).length;

      const unreadAlerts = notifications.filter(
        (notification) =>
          !notification.is_read &&
          notification.is_read !== 1
      ).length;

      setD({
        journeys: journeys.length,
        reports: issues.length,
        alerts: unreadAlerts,
        parkingOptions,
        traffic,
        parking,
        transport,
        issues,
      });

      setError(
        failedWidgets.length
          ? `Some data couldn't be refreshed: ${failedWidgets.join(", ")}.`
          : ""
      );

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Dashboard update failed:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to load some dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial dashboard load
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboard();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadDashboard]);

  /*
   * Prepare all map markers safely.
   * Invalid latitude/longitude values are ignored.
   */
  const mapMarkers = [
    ...d.traffic
      .filter(
        (x) =>
          x.latitude !== null &&
          x.latitude !== undefined &&
          x.longitude !== null &&
          x.longitude !== undefined
      )
      .map((x) => ({
        ...x,
        name: `Traffic · ${x.location || "Traffic incident"}`,
      })),

    ...d.parking
      .filter(
        (x) =>
          x.latitude !== null &&
          x.latitude !== undefined &&
          x.longitude !== null &&
          x.longitude !== undefined
      )
      .map((x) => ({
        ...x,
        name: `Parking · ${x.name || "Parking"}`,
      })),

    ...d.transport
      .filter(
        (x) =>
          x.latitude !== null &&
          x.latitude !== undefined &&
          x.longitude !== null &&
          x.longitude !== undefined
      )
      .map((x) => ({
        ...x,
        name: `Transport · ${x.route_number || "Route"}`,
      })),

    ...d.issues
      .filter(
        (x) =>
          x.latitude !== null &&
          x.latitude !== undefined &&
          x.longitude !== null &&
          x.longitude !== undefined
      )
      .map((x) => ({
        ...x,
        name: `Issue #${x.id}`,
      })),
  ];

  return (
    <>
      <div className="page-title">
        <div>
          <span className="eyebrow">YOUR DASHBOARD</span>

          <h1>
            Good day,{" "}
            {user?.full_name?.split(" ")[0] || "User"}.
          </h1>

          <p>
            Your connected view of city mobility.
          </p>

          {lastUpdated && (
            <small>
              Live data updated at{" "}
              {lastUpdated.toLocaleTimeString()}
            </small>
          )}
        </div>

        <Link
          className="btn primary"
          to="/plan-journey"
        >
          <Route size={18} />
          Plan a journey
        </Link>
      </div>

      {error && (
        <div
          className="panel"
          style={{
            marginBottom: "20px",
            padding: "14px 18px",
          }}
        >
          <strong>Dashboard notice</strong>
          <p style={{ marginBottom: 0 }}>
            {error}
          </p>
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          icon={Route}
          label="Today's journeys"
          value={loading ? "..." : d.journeys}
        />

        <StatCard
          icon={FileWarning}
          label="Reported issues"
          value={loading ? "..." : d.reports}
        />

        <StatCard
          icon={Bell}
          label="Unread alerts"
          value={loading ? "..." : d.alerts}
        />

        <StatCard
          icon={ParkingSquare}
          label="Parking options"
          value={loading ? "..." : d.parkingOptions}
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel active-trip-panel">
          <div className="panel-head"><div><span className="eyebrow">MOBILITY CENTER</span><h2>Go further with SMARTMOVE</h2></div></div>
          <div className="mobility-actions">
            <Link className="mobility-action" to="/plan-journey"><Navigation/><span><b>Start a live trip</b><small>Track location, ETA and traffic</small></span><ArrowRight size={15}/></Link>
            <Link className="mobility-action" to="/analytics"><BarChart3/><span><b>View analytics</b><small>Trips, distance and transport mix</small></span><ArrowRight size={15}/></Link>
            <Link className="mobility-action danger-action" to="/emergency"><ShieldAlert/><span><b>Safety & SOS</b><small>Emergency contacts and services</small></span><ArrowRight size={15}/></Link>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* LIVE MAP */}
        <div className="panel map-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">
                LIVE VIEW
              </span>

              <h2>
                City mobility map
              </h2>
            </div>

            <Link to="/live-traffic">
              Open map
              <ArrowRight size={15} />
            </Link>
          </div>

          <MapView
            markers={mapMarkers}
            height={390}
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">
                QUICK ACTIONS
              </span>

              <h2>
                What do you need?
              </h2>
            </div>
          </div>

          <div className="quick-grid">
            {[
              [
                Route,
                "Plan Journey",
                "/plan-journey",
              ],
              [
                ParkingSquare,
                "Find Parking",
                "/parking",
              ],
              [
                Activity,
                "Live Traffic",
                "/live-traffic",
              ],
              [
                FileWarning,
                "Report Issue",
                "/report-issue",
              ],
            ].map(
              ([Icon, title, path]) => (
                <Link
                  className="quick"
                  to={path}
                  key={title}
                >
                  <Icon />

                  <span>
                    {title}
                  </span>

                  <ArrowRight size={15} />
                </Link>
              )
            )}
          </div>

          <div className="mini-callout">
            <TrendingUp />

            <div>
              <b>
                Stay informed
              </b>

              <span>
                Check active alerts before you travel.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}