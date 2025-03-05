import { useEffect, useState } from "react";
import axios from "axios";
import "./Invoices.css";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({ amount: 0, status: "Unpaid" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/invoices").then((res) => setInvoices(res.data));
  }, []);

  const handleAddInvoice = async () => {
    const res = await axios.post("http://localhost:5000/api/invoices", newInvoice);
    setInvoices([...invoices, res.data]);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/invoices/${id}`);
    setInvoices(invoices.filter((i) => i._id !== id));
  };

  return (
    <div className="invoice-container">
      <h2>Invoice Management</h2>
      <div className="input-container">
        <input
          type="number"
          placeholder="Amount"
          onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
        />
        <button onClick={handleAddInvoice}>Add Invoice</button>
      </div>
      <ul className="invoice-list">
        {invoices.map((invoice) => (
          <li key={invoice._id}>
            <span>${invoice.amount} - {invoice.status}</span>
            <button className="delete-btn" onClick={() => handleDelete(invoice._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Invoices;
