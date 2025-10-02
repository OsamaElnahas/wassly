import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faCartShopping,
  faUsers,
  faChartLine,
  faDollarSign,
  faClock,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Wassally Dashboard</title>
        <meta
          name="description"
          content="هي لوحة إدارة متكاملة لأعمال التوصيل، توفر أدوات قوية لإدارة المتاجر، الطلبات، الطيارين والمعاملات المالية، مع تصميم احترافي وتجربة مستخدم سهلة وواضحة، تدعم جميع الأجهزة وتوفر واجهات تفاعلية لعرض وتحليل البيانات"
        />
      </Helmet>
      <div className={styles.homeWrapper}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container">
            <div className="row justify-content-center animate__animated animate__fadeIn animate__delay-1s">
              <div className="col-12 text-center">
                <div className={styles.heroContent}>
                  <div className={styles.welcomeBadge}>Dashboard</div>
                  <h1 className={styles.mainTitle}>
                    Welcome to <span className={styles.accent}>Wassally</span>
                  </h1>
                  <p className={styles.heroSubtitle}>
                    Manage your business with ease. Track orders, manage shops,
                    and oversee your team in one intuitive platform.
                  </p>
                  {/* <div className={styles.heroStats}>
                    <div className={styles.statItem}>
                      <FontAwesomeIcon
                        icon={faChartLine}
                        className={styles.statIcon}
                      />
                      <span>Real-time Analytics</span>
                    </div>
                    <div className={styles.statItem}>
                      <FontAwesomeIcon
                        icon={faClock}
                        className={styles.statIcon}
                      />
                      <span>24/7 Support</span>
                    </div>
                    <div className={styles.statItem}>
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className={styles.statIcon}
                      />
                      <span>Secure Payments</span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Cards */}
        <section className={styles.navSection}>
          <div className="container">
            <div className="row justify-content-center animate__animated animate__fadeInUp animate__delay-2s">
              <div className="col-lg-4 col-md-6 mb-4">
                <Link
                  to="/shops"
                  className={`text-decoration-none ${styles.navLink}`}
                >
                  <div
                    className={`${styles.navCard} ${styles.cardShadow} h-100`}
                  >
                    <div className={styles.cardContent}>
                      <div className={styles.cardIconWrapper}>
                        <FontAwesomeIcon
                          icon={faStore}
                          className={styles.cardIcon}
                        />
                      </div>
                      <h3 className={styles.cardTitle}>Shops</h3>
                      <p className={styles.cardDescription}>
                        Manage your shops, and monitor performance.
                      </p>
                      <div className={styles.cardFooter}>
                        <span className={styles.cardAction}>Go to Shops</span>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className={styles.arrowIcon}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 mb-4">
                <Link
                  to="/orders"
                  className={`text-decoration-none ${styles.navLink}`}
                >
                  <div
                    className={`${styles.navCard} ${styles.cardShadow} h-100`}
                  >
                    <div className={styles.cardContent}>
                      <div className={styles.cardIconWrapper}>
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          className={styles.cardIcon}
                        />
                      </div>
                      <h3 className={styles.cardTitle}>Orders</h3>
                      <p className={styles.cardDescription}>
                        Track process, and fulfill customer orders in real-time.
                      </p>
                      <div className={styles.cardFooter}>
                        <span className={styles.cardAction}>View Orders</span>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className={styles.arrowIcon}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 mb-4">
                <Link
                  to="/tayareen"
                  className={`text-decoration-none ${styles.navLink}`}
                >
                  <div
                    className={`${styles.navCard} ${styles.cardShadow} h-100`}
                  >
                    <div className={styles.cardContent}>
                      <div className={styles.cardIconWrapper}>
                        <FontAwesomeIcon
                          icon={faUsers}
                          className={styles.cardIcon}
                        />
                      </div>
                      <h3 className={styles.cardTitle}>Drivers</h3>
                      <p className={styles.cardDescription}>
                        manage your delivery team.
                      </p>
                      <div className={styles.cardFooter}>
                        <span className={styles.cardAction}>Manage Team</span>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className={styles.arrowIcon}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Stats Overview Cards - Static placeholders */}
        {/* <section className={styles.statsSection}>
          <div className="container">
            <div className="row justify-content-center animate__animated animate__fadeInUp animate__delay-2s">
              <div className="col-lg-3 col-md-6 mb-4">
                <div className={`${styles.statCard} ${styles.cardShadow}`}>
                  <div className={styles.statHeader}>
                    <FontAwesomeIcon
                      icon={faStore}
                      className={styles.statIconLarge}
                    />
                    <h3 className={styles.statNumber}>124</h3>
                  </div>
                  <p className={styles.statLabel}>Active Shops</p>
                  <div className={styles.statTrend}>
                    <span className={styles.trendUp}>+12% from last month</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-4">
                <div className={`${styles.statCard} ${styles.cardShadow}`}>
                  <div className={styles.statHeader}>
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      className={styles.statIconLarge}
                    />
                    <h3 className={styles.statNumber}>856</h3>
                  </div>
                  <p className={styles.statLabel}>Total Orders</p>
                  <div className={styles.statTrend}>
                    <span className={styles.trendUp}>+25% growth</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-4">
                <div className={`${styles.statCard} ${styles.cardShadow}`}>
                  <div className={styles.statHeader}>
                    <FontAwesomeIcon
                      icon={faUsers}
                      className={styles.statIconLarge}
                    />
                    <h3 className={styles.statNumber}>47</h3>
                  </div>
                  <p className={styles.statLabel}>Delivery Personnel</p>
                  <div className={styles.statTrend}>
                    <span className={styles.trendDown}>-2% availability</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-4">
                <div className={`${styles.statCard} ${styles.cardShadow}`}>
                  <div className={styles.statHeader}>
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      className={styles.statIconLarge}
                    />
                    <h3 className={styles.statNumber}>$12,450</h3>
                  </div>
                  <p className={styles.statLabel}>Monthly Revenue</p>
                  <div className={styles.statTrend}>
                    <span className={styles.trendUp}>+18% increase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </>
  );
}
