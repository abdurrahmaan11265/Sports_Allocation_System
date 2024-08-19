import React, { useState, useEffect } from 'react';
import { PiStudentBold } from "react-icons/pi";
import axios from 'axios';
// import { Navigate } from 'react-router-dom';

const StudentDashboardPage = ({ userInfo }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [items, setItems] = useState([]);
    const [requests, setRequests] = useState([]);

    const token = userInfo.token;
    const BASE_URL = "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsResponse, requestsResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/api/items`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/api/requests/`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setItems(itemsResponse.data);
                setRequests(requestsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [token, BASE_URL]);

    const handleRequest = async (event) => {
        event.preventDefault();
        try {
            const item = items.find(item => item.name === selectedItem);
            if (item) {
                await axios.post(`${BASE_URL}/api/requests`, {
                    itemId: item._id,
                    returnBy: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
                }, { headers: { Authorization: `Bearer ${token}` } });
                alert("Your Request has been submitted!!");

                const updatedRequests = await axios.get(`${BASE_URL}/api/requests/`, { headers: { Authorization: `Bearer ${token}` } });
                setRequests(updatedRequests.data);
                setSelectedItem('');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('An unexpected error occurred.');
            }
        }
    };

    return (
        <>
            <nav className="navbar navbar-light">
                <div className="container d-flex justify-content-center align-items-center">
                    <span className="navbar-brand d-flex align-items-center">
                        <PiStudentBold fontSize={"30px"} />
                        <h1 className="ms-2 mb-0">Student Dashboard</h1>
                    </span>
                </div>
            </nav>

            <section className="userDetails container mt-5">
                <div className="card">
                    <div className="card-header text-white">
                        Student Details
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Username: {userInfo.username}</h5>
                        <p className="card-text">Welcome, {userInfo.username}! Here you can manage your requests and view available items.</p>
                    </div>
                </div>
            </section>

            <section className="requestForm container mt-5">
                <div className="card">
                    <div className="card-header text-white">
                        Request an Item
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleRequest}>
                            <div className="mb-3">
                                <label htmlFor="itemSelect" className="form-label">Select Item</label>
                                <select
                                    id="itemSelect"
                                    className="form-select"
                                    value={selectedItem}
                                    onChange={(e) => setSelectedItem(e.target.value)}
                                    required
                                >
                                    <option value="">Select an item</option>
                                    {items.filter(item => item.status === 'Available').map(item => (
                                        <option key={item._id} value={item.name}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Request Item</button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="itemList container mt-5">
                <div className="card">
                    <div className="card-header text-white">
                        Available Items
                    </div>
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Condition</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.condition}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="requestList container mt-5">
                <div className="card">
                    <div className="card-header text-white">
                        My Requests
                    </div>
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Status</th>
                                    {/* <th>Borrowed At</th> */}
                                    {/* <th>Return By</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {requests
                                    .filter(request => request.student.username === userInfo.username)
                                    .map(filteredRequest => (
                                        <tr key={filteredRequest._id}>
                                            <td>{filteredRequest.item.name}</td>
                                            <td>{filteredRequest.status}</td>
                                            {/* <td>{filteredRequest.borrowedAt.split('T')[0]}</td>
                                            <td>{filteredRequest.returnBy.split('T')[0]}</td> */}
                                        </tr>
                                    ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
}

// Example usage
const App = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        setUserInfo(user);
    }, []);

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return <StudentDashboardPage userInfo={userInfo} />;
}

export default App;
