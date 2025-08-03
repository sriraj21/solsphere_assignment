import React, { useState, useEffect, useMemo } from 'react';

// --- Helper Functions & Components ---

// Icon component for better UI
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

const ICONS = {
    desktop: "M3 5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0v10h14V5H5z",
    check: "M19.78 6.22a.75.75 0 010 1.06l-9.5 9.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06L9.5 14.94l9.22-9.22a.75.75 0 011.06 0z",
    warning: "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 18a.75.75 0 01-.75-.75v.008c0-.414.336-.75.75-.75s.75.336.75.75v-.008A.75.75 0 0112 18zm-1.03-5.353a.75.75 0 011.06-.02l.02.02 1.5 1.5a.75.75 0 11-1.06 1.06l-1.5-1.5a.75.75 0 010-1.06zM12 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0112 6z",
    apple: "M12.025 2.008c.253-.001.506 0 .759.002 1.334.007 2.665.175 3.965.518 1.286.34 2.52.88 3.645 1.595a.75.75 0 01-.63 1.312 8.45 8.45 0 00-1.51-.553c-1.125-.346-2.29-.523-3.48-.532-1.22-.008-2.438.156-3.62.483-1.15.32-2.25.79-3.245 1.378-.992.585-1.91 1.34-2.675 2.233-1.513 1.768-2.45 3.915-2.45 6.113 0 1.22.21 2.415.62 3.565.41 1.15.99 2.24 1.73 3.23.75.99 1.66 1.87 2.7 2.6.99.7 2.1 1.24 3.3 1.58.5.14 1 .26 1.5.36.15.03.3.05.45.07.25.03.5.05.75.05.25 0 .5-.02.75-.05.15-.02.3-.04.45-.07.5-.1.99-.22 1.5-.36 1.2-.34 2.3-.88 3.3-1.58 1.03-.73 1.95-1.61 2.7-2.6.73-.99 1.32-2.08 1.73-3.23.41-1.15.62-2.345.62-3.565 0-.272-.005-.544-.015-.815a.75.75 0 011.5-.03c.01.29.015.58.015.875 0 2.478-.98 4.89-2.885 6.795-.99.99-2.12 1.83-3.35 2.48-.99.52-2.06.9-3.18 1.11-.55.11-1.1.18-1.65.22-.2.02-.4.02-.6.02s-.4 0-.6-.02c-.55-.04-1.1-.11-1.65-.22-1.12-.22-2.19-.59-3.18-1.11-1.23-.65-2.36-1.49-3.35-2.48C2.98 18.89.99 16.478.99 14.001c0-2.435.94-4.79 2.73-6.62C4.72 6.388 5.8 5.56 6.99 4.86c1.18-.7 2.48-1.23 3.84-1.55C11.33 3.2 11.83 3.1 12.33 3c.15-.01.3-.02.45-.02.25 0 .5 0 .75.002a10.01 10.01 0 01-.227-.994zM13.5 3.5c-.44 0-.88.02-1.31.05-1.2.1-2.37.38-3.46.8-1.09.42-2.08.98-2.92 1.66-.84.68-1.55 1.5-2.08 2.43-.53.93-.86 1.97-.86 3.06 0 .99.24 1.98.71 2.88.47.9.99 1.63 1.59 2.2.6.57 1.22.98 1.86 1.23.64.25 1.28.36 1.92.36s1.28-.11 1.92-.36c.64-.25 1.26-.66 1.86-1.23.6-.57 1.12-1.3 1.59-2.2.47-.9.71-1.89.71-2.88 0-1.2-.38-2.34-1.02-3.36a.75.75 0 011.23-.84c.78 1.2 1.29 2.64 1.29 4.2 0 1.2-.28 2.38-.82 3.48-.54 1.1-1.26 2.08-2.13 2.88-.87.8-1.88 1.44-2.98 1.86a5.41 5.41 0 01-4.2 0c-1.1-.42-2.11-1.06-2.98-1.86-.87-.8-1.59-1.78-2.13-2.88-.54-1.1-.82-2.28-.82-3.48 0-1.42.4-2.82 1.15-4.06.75-1.24 1.74-2.3 2.92-3.1C8.92 4.41 10.2 3.88 11.54 3.6c.45-.07.9-.1 1.35-.1.15 0 .3 0 .45.01.15.01.3.02.45.04.15.02.3.04.45.06.15.02.3.05.45.08a.75.75 0 01-.74 1.42 6.2 6.2 0 00-1.2-.21z",
    windows: "M2 5.54v12.92c0 .86.84 1.54 1.88 1.54h16.24c1.04 0 1.88-.68 1.88-1.54V5.54c0-.86-.84-1.54-1.88-1.54H3.88C2.84 4 2 4.68 2 5.54zM20.12 5H12V2.5a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5V5H3.88a.88.88 0 00-.88.88V11h18V5.88a.88.88 0 00-.88-.88zm-17.24 7v5.12c0 .48.4.88.88.88h16.24a.88.88 0 00.88-.88V12H2.88zM12 18.5a.5.5 0 00.5.5h1a.5.5 0 00.5-.5V12h-2v6.5z",
    linux: "M5.903 4.255a.75.75 0 01.94-.34l.11.045 3.002 1.715a.75.75 0 010 1.34l-3.002 1.715a.75.75 0 11-.76-1.31l2.3-1.315-2.3-1.315a.75.75 0 01-.34-.94zM11.25 3.75h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5zM7.6 12.44a.75.75 0 00.94.34l.11-.045 3.002-1.715a.75.75 0 000-1.34l-3.002-1.715a.75.75 0 10-.76 1.31l2.3 1.315-2.3 1.315a.75.75 0 00-.34.94zM12.75 11.25h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5zM12 19.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5a.75.75 0 01-.75-.75zM4.5 19.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 014.5 19.5zM19.5 19.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5a.75.75 0 01-.75-.75zM12 13.125a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM12 6.375a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM6.375 13.125a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM6.375 6.375a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM17.625 13.125a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM17.625 6.375a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
};

const OS_ICON_MAP = {
    macos: <Icon path={ICONS.apple} className="w-5 h-5 text-gray-500" />,
    windows: <Icon path={ICONS.windows} className="w-5 h-5 text-blue-500" />,
    linux: <Icon path={ICONS.linux} className="w-5 h-5 text-yellow-600" />,
    default: <Icon path={ICONS.desktop} className="w-5 h-5 text-gray-400" />,
};

// The URL where your backend server is running
const API_URL = 'http://localhost:5000';

function App() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters
    const [osFilter, setOsFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // This useEffect hook runs when the component loads.
    // It fetches data from your backend server.
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the list of machines from the backend API
                const response = await fetch(`${API_URL}/api/machines`);
                if (!response.ok) {
                    // If the server responds with an error, throw an error
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMachines(data); // Store the fetched data in our state
                setError(null); // Clear any previous errors
            } catch (e) {
                console.error("Failed to fetch machine data:", e);
                // Set a more helpful error message in the UI
                setError(
                    <>
                        <p className="font-bold">Could not connect to the backend server.</p>
                        <p className="mt-2 text-sm text-gray-400">
                            Please make sure the backend server is running in a separate terminal.
                            <br />
                            In the `backend` folder, run the command: 
                            <code className="ml-2 bg-gray-700 p-1 rounded-md">node index.js</code>
                        </p>
                    </>
                );
            } finally {
                setLoading(false); // Stop showing the loading message
            }
        };

        fetchData(); // Fetch data immediately when the app loads
        
        // Set up a timer to fetch data every 5 seconds
        const intervalId = setInterval(fetchData, 5000);

        // Clean up the timer when the component is removed
        return () => clearInterval(intervalId);
    }, []); // The empty array [] means this effect runs only once on mount


    // --- Filtering Logic ---
    const filteredMachines = useMemo(() => {
        return machines
            .filter(machine => {
                if (osFilter === 'all') return true;
                return machine.os?.toLowerCase() === osFilter;
            })
            .filter(machine => {
                if (statusFilter === 'all') return true;
                if (statusFilter === 'issues') return machine.issues && machine.issues.length > 0;
                if (statusFilter === 'ok') return !machine.issues || machine.issues.length === 0;
                return true;
            });
    }, [machines, osFilter, statusFilter]);

    // --- Helper Functions ---
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        // The timestamp from the backend is an ISO string
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="bg-gray-900 min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-gray-400 mt-1">System Health & Status (Connected to Backend)</p>
                    </div>
                </header>

                {/* Filters */}
                <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-4 items-center">
                    <span className="font-semibold text-white">Filter by:</span>
                    <div className="flex gap-4">
                        <select
                            value={osFilter}
                            onChange={(e) => setOsFilter(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        >
                            <option value="all">All OS</option>
                            <option value="macos">macOS</option>
                            <option value="windows">Windows</option>
                            <option value="linux">Linux</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                             className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        >
                            <option value="all">All Statuses</option>
                            <option value="issues">With Issues</option>
                            <option value="ok">OK</option>
                        </select>
                    </div>
                </div>

                {/* Main Content: Machine List */}
                <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                             <p className="text-center p-8">Loading machines...</p>
                        ) : error ? (
                             <div className="text-center p-8 text-yellow-300 bg-yellow-900 rounded-lg">
                                {error}
                             </div>
                        ) : filteredMachines.length === 0 ? (
                            <p className="text-center p-8 text-gray-400">No reporting machines found. Start a client utility to send data to the backend.</p>
                        ) : (
                            <table className="w-full text-sm text-left text-gray-400">
                                <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Hostname</th>
                                        <th scope="col" className="px-6 py-3">OS</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Last Check-in</th>
                                        <th scope="col" className="px-6 py-3">Issues</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMachines.map(machine => (
                                        <tr key={machine.machineId} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600 transition-colors duration-200">
                                            <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                                {machine.hostname || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {OS_ICON_MAP[machine.os?.toLowerCase()] || OS_ICON_MAP.default}
                                                    <span>{machine.osVersion || machine.os || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {machine.issues && machine.issues.length > 0 ? (
                                                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                                                        <Icon path={ICONS.warning} className="w-3 h-3" />
                                                        Issues
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                                        <Icon path={ICONS.check} className="w-3 h-3" />
                                                        OK
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatTimestamp(machine.lastCheckIn)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {machine.issues && machine.issues.length > 0 ? (
                                                    <ul className="list-disc list-inside text-red-400">
                                                        {machine.issues.map((issue, index) => (
                                                            <li key={index}>{issue}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-500">None</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                 <footer className="text-center text-gray-500 mt-8 text-sm">
                    <p>System Health Dashboard v2.0</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
