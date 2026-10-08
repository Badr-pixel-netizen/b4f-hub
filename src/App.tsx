import Header from "./components/Header";
import Footer from "./components/Footer";
import CommunitySection from "./components/community/CommunitySection";
import OpportunitiesSection from "./components/opportunities/OpportunitiesSection";
import NotificationToast from "./components/NotificationToast";
import { useNotificationQueue } from "./hooks/useNotificationQueue";

function App() {
  const { frontNotification, waitingCount, notify, dismissFront } = useNotificationQueue();

  return (
    <div className="root">
      <Header />
      <main className="main-container">
        <CommunitySection onNotify={notify} />
        <OpportunitiesSection onNotify={notify} />
      </main>
      <Footer />
      <NotificationToast
        notification={frontNotification}
        waitingCount={waitingCount}
        onDismiss={dismissFront}
      />
    </div>
  );
}

export default App;
