import "./App.css";

function App() {

  return (
    <>
      <div className="flex h-screen bg-gray-200 font-roboto">
        <div className="flex">
          <div className="hidden fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>
          <div
            className="-translate-x-full ease-in fixed inset-y-0 left-0 z-30 w-96
        overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0"
          >
            <ul>
              <li>Test data</li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <p>Map</p>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
