import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserForm from './UserForm';
import UserList from './UserList';
import TransactionPage from './TransactionPage';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-6">
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav className="flex flex-col gap-4">
            <Link to="/" className="hover:text-blue-400">Add User</Link>
            <Link to="/users" className="hover:text-blue-400">View Users</Link>
            <Link to="/transactions" className="hover:text-blue-400">Transaction Monitoring</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <Routes>
            <Route path="/" element={<UserForm />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/transactions" element={<TransactionPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
