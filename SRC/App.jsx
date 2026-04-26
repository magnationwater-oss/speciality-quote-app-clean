import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function App() {
  const [client, setClient] = useState("");
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");
  const [quoteNumber, setQuoteNumber] = useState(108026);

  useEffect(() => {
    const saved = localStorage.getItem("quoteNumber");
    if (saved) setQuoteNumber(parseInt(saved));
  }, []);

  const addItem = () => {
    if (!description || !rate) return;
    setItems([...items, { description, rate: parseFloat(rate) }]);
    setDescription("");
    setRate("");
  };

  const total = items.reduce((sum, item) => sum + item.rate, 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Quotation #${quoteNumber}`, 10, 10);
    doc.text(`Client: ${client}`, 10, 20);

    let y = 40;
    items.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.description} - R ${item.rate.toFixed(2)}`, 10, y);
      y += 10;
    });

    doc.text(`Total: R ${total.toFixed(2)}`, 10, y + 10);
    doc.save(`Quotation-${quoteNumber}.pdf`);

    const next = quoteNumber + 1;
    setQuoteNumber(next);
    localStorage.setItem("quoteNumber", next);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Speciality Quote System</h1>
      <input placeholder="Client Name" value={client} onChange={(e) => setClient(e.target.value)} />
      <input placeholder="Item Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
      <button onClick={addItem}>Add Line Item</button>
      <button onClick={generatePDF}>Download PDF</button>

      <h3>Quotation #{quoteNumber}</h3>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item.description} - R {item.rate.toFixed(2)}</li>
        ))}
      </ul>
      <h3>Total: R {total.toFixed(2)}</h3>
    </div>
  );
}
