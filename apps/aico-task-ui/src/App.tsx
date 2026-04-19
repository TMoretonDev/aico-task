import { Toaster } from './components/ui';
import { DeviceManagement } from './pages/device-management/DeviceManagement';

function App() {
  return (
    <>
      <DeviceManagement />
      <Toaster richColors position="bottom-right" />
    </>
  );
}

export default App;
