import React, { useState, useEffect } from 'react';
import { GrUserAdmin } from "react-icons/gr";
import axios from 'axios';

const AdminDashboardPage = ({ userInfo }) => {
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [condition, setCondition] = useState('');

    const [items, setItems] = useState([]);
    const [editItem, setEditItem] = useState(null);

    const [requests, setRequests] = useState([]);
    const [editRequest, setEditRequest] = useState(null);
    const [status, setStatus] = useState('');

    const token = userInfo.token;
    // const BASE_URL = "http://localhost:5000";
    const BASE_URL = "https://sports-allocation-system.onrender.com";

    useEffect(() => {
        // Fetch all items and requests
        const fetchData = async () => {
            try {
                const [itemsResponse, requestsResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/api/items`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/api/requests`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setItems(itemsResponse.data);
                setRequests(requestsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [token, BASE_URL]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editItem) {
                await axios.put(`${BASE_URL}/api/items/${editItem._id}`, {
                    // id: editItem._id,
                    name: itemName,
                    category,
                    quantity,
                    condition
                }, { headers: { Authorization: `Bearer ${token}` } });



                const updatedItems = items.map(item =>
                    item._id === editItem._id
                        ? { ...item, name: itemName, category, quantity, condition }
                        : item
                );
                setItems(updatedItems);
                setEditItem(null);
            } else {
                await axios.post(`${BASE_URL}/api/items`, {
                    name: itemName,
                    category,
                    quantity,
                    condition
                }, { headers: { Authorization: `Bearer ${token}` } });

                const newItem = { id: Date.now(), name: itemName, category, quantity, condition, status: 'Available' };
                setItems([...items, newItem]);
            }
            setItemName('');
            setCategory('');
            setQuantity('');
            setCondition('');
        } catch (error) {
            console.error('Error submitting request:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('An unexpected error occurred.');
            }
        }
    };

    const handleEditItem = (item) => {
        setItemName(item.name);
        setCategory(item.category);
        setQuantity(item.quantity);
        setCondition(item.condition);
        setEditItem(item);
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
                // , data: { id }
            });
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error submitting request:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('An unexpected error occurred.');
            }
        }
    };

    const handleEditRequest = (request) => {
        setEditRequest(request);
        setStatus(request.status);
    };

    const handleUpdateRequest = async (id) => {
        try {
            await axios.put(`${BASE_URL}/api/requests/${id}`, {
                status
            }, { headers: { Authorization: `Bearer ${token}` } });

            const updatedRequests = requests.map(req =>
                req._id === id
                    ? { ...req, status }
                    : req
            );
            setRequests(updatedRequests);
            setEditRequest(null);
            setStatus('');

            // asdf
            const itemsResponse = await axios.get(`${BASE_URL}/api/items`, { headers: { Authorization: `Bearer ${token}` } });
            setItems(itemsResponse.data);
        } catch (error) {
            console.error('Error submitting request:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('An unexpected error occurred.');
            }
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <nav className="navbar navbar-light">
                <div className="container d-flex justify-content-center align-items-center">
                    <span className="navbar-brand d-flex align-items-center">
                        <GrUserAdmin fontSize="30px" />
                        <h1 className="ms-2 mb-0">Admin Dashboard</h1>
                    </span>
                </div>
            </nav>

            <section className="userDetails container mt-5">
                <div className="card">
                    <div className="card-header text-white">
                        User Details
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">User: {userInfo.username}</h5>
                        <p className="card-text">Welcome, {userInfo.username}! Here you can manage your tasks.</p>
                    </div>
                </div>
            </section>

            <section className="itemForm container mt-5">
                <div className="card">
                    <div className="card-header text-white">
                        {editItem ? 'Edit Item' : 'Add New Item'}
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="itemName" className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="itemName"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="category" className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="condition" className="form-label">Condition</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="condition"
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                {editItem ? 'Update Item' : 'Add Item'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="itemTable container mt-5">
                <div className="card">
                    <div className="card-header text-white">
                        Item List
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
                                    <th>Actions</th>
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
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditItem(item)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="requestTable container mt-5">
                <div className="card">
                    <div className="card-header text-white">
                        Requests
                    </div>
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Student</th>
                                    <th>Status</th>
                                    {/* <th>Borrowed At</th> */}
                                    {/* <th>Return By</th> */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request._id}>
                                        <td>{request.item.name}</td>
                                        <td>{request.student.username}</td>
                                        <td>
                                            {editRequest && editRequest._id === request._id ? (
                                                <select
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                >
                                                    {request.status !== "Approved" &&
                                                        <option value="Pending">Pending</option>}
                                                    <option value="Approved">Approved</option>
                                                    {request.status !== "Approved" &&
                                                        <option value="Denied">Denied</option>}
                                                    {request.status !== "Pending" &&
                                                        <option value="Item Returned">Item Returned</option>}
                                                </select>
                                            ) : (
                                                request.status
                                            )}
                                        </td>
                                        {/* <td>{request.borrowedAt}</td> */}
                                        <td>{request.returnBy}</td>
                                        {!(request.status === "Item Returned" || request.status === "Denied") &&
                                            <td>
                                                {editRequest && editRequest._id === request._id ? (
                                                    <button className="btn btn-success btn-sm" onClick={() => handleUpdateRequest(request._id)}>Update</button>
                                                ) : (
                                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditRequest(request)}>Edit</button>
                                                )}
                                            </td>
                                        }
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

// Example usage with hardcoded username
const App = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Get user info from local storage
        const user = JSON.parse(localStorage.getItem('userInfo'));
        setUserInfo(user);
    }, []);

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return <AdminDashboardPage userInfo={userInfo} />;
}

export default App;
