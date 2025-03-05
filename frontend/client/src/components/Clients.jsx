import { useState, useEffect } from "react";
import axios from "axios";
import "./Clients.css";

const Clients = () => {
  const clientTypes = ["Enterprise", "Small Business", "Law Firm", "Startup", "Healthcare"];
  const clientSources = ["Phone Outreach", "Website", "Email Campaign", "Advertisement", "Networking", "Social Media", "Referral", "LinkedIn"];
  const clientPriorities = ["High", "Medium", "Low"];
  const clientStatuses = ["Won (Closed)", "Lost (Closed)", "Status 1", "Status 2", "Status 3", "Status 4"];

  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: "",
    type: "",
    source: "",
    priority: "",
    status: "",
  });

  const [editClient, setEditClient] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/clients")
      .then(response => setClients(response.data))
      .catch(error => console.error("Error fetching clients:", error));
  }, []);

  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const addClient = () => {
    if (!newClient.name || !newClient.type || !newClient.source || !newClient.priority || !newClient.status) {
      alert("Please fill all fields!");
      return;
    }
    
    axios.post("http://localhost:5000/api/clients", newClient)
      .then(response => {
        setClients([...clients, response.data]);
        setNewClient({ name: "", type: "", source: "", priority: "", status: "" });
      })
      .catch(error => console.error("Error adding client:", error));
  };

  const startEditing = (client) => {
    setEditClient(client);
    setNewClient(client);
  };

  const updateClient = () => {
    axios.put(`http://localhost:5000/api/clients/${editClient._id}`, newClient)
      .then(response => {
        setClients(clients.map(client => (client._id === editClient._id ? response.data : client)));
        setNewClient({ name: "", type: "", source: "", priority: "", status: "" });
        setEditClient(null);
      })
      .catch(error => console.error("Error updating client:", error));
  };

  const deleteClient = (id) => {
    axios.delete(`http://localhost:5000/api/clients/${id}`)
      .then(() => {
        setClients(clients.filter(client => client._id !== id));
      })
      .catch(error => console.error("Error deleting client:", error));
  };

  return (
    <div className="clients-container">
      <h2>Client Management</h2>
      
      {/* Client Form */}
      <div className="client-form">
        <input type="text" name="name" value={newClient.name} onChange={handleChange} placeholder="Client Name" />
        
        <select name="type" value={newClient.type} onChange={handleChange}>
          <option value="">Select Client Type</option>
          {clientTypes.map((type, index) => <option key={index} value={type}>{type}</option>)}
        </select>

        <select name="source" value={newClient.source} onChange={handleChange}>
          <option value="">Select Client Source</option>
          {clientSources.map((source, index) => <option key={index} value={source}>{source}</option>)}
        </select>

        <select name="priority" value={newClient.priority} onChange={handleChange}>
          <option value="">Select Priority</option>
          {clientPriorities.map((priority, index) => <option key={index} value={priority}>{priority}</option>)}
        </select>

        <select name="status" value={newClient.status} onChange={handleChange}>
          <option value="">Select Status</option>
          {clientStatuses.map((status, index) => <option key={index} value={status}>{status}</option>)}
        </select>

        {editClient ? (
          <button className="update-btn" onClick={updateClient}>Update Client</button>
        ) : (
          <button className="add-btn" onClick={addClient}>Add Client</button>
        )}
      </div>

      {/* Clients Table */}
      <table className="clients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Source</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.type}</td>
                <td>{client.source}</td>
                <td>{client.priority}</td>
                <td>{client.status}</td>
                <td>
                  <button className="edit-btn" onClick={() => startEditing(client)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteClient(client._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">No clients added yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Clients;
