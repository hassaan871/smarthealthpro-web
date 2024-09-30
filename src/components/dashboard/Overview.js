import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Overview = () => {
  const salesData = [
    { name: 'Jan', value: 18 }, { name: 'Feb', value: 16 },
    { name: 'Mar', value: 5 }, { name: 'Apr', value: 8 },
    { name: 'May', value: 3 }, { name: 'Jun', value: 14 },
    { name: 'Jul', value: 14 }, { name: 'Aug', value: 16 },
    { name: 'Sep', value: 17 }, { name: 'Oct', value: 18 },
    { name: 'Nov', value: 17 }, { name: 'Dec', value: 19 },
  ];

  const trafficData = [
    { name: 'Desktop', value: 63 },
    { name: 'Tablet', value: 15 },
    { name: 'Phone', value: 22 },
  ];

  const products = [
    { name: 'Soja & Co. Eucalyptus', updated: 'Mar 8, 2024' },
    { name: 'Necessaire Body Lotion', updated: 'Mar 8, 2024' },
    { name: 'Ritual of Sakura', updated: 'Mar 8, 2024' },
    { name: 'Lancome Rouge', updated: 'Mar 8, 2024' },
    { name: 'Erbology Aloe Vera', updated: 'Mar 8, 2024' },
  ];

  const orders = [
    { id: 'ORD-007', customer: 'Ekaterina Tankova', date: 'Mar 8, 2024', status: 'Pending' },
    { id: 'ORD-006', customer: 'Cao Yu', date: 'Mar 8, 2024', status: 'Delivered' },
    { id: 'ORD-004', customer: 'Alexa Richardson', date: 'Mar 8, 2024', status: 'Refunded' },
    { id: 'ORD-003', customer: 'Anje Keizer', date: 'Mar 8, 2024', status: 'Pending' },
    { id: 'ORD-002', customer: 'Clarke Gillebert', date: 'Mar 8, 2024', status: 'Delivered' },
    { id: 'ORD-001', customer: 'Adam Denisov', date: 'Mar 8, 2024', status: 'Delivered' },
  ];

  const COLORS = ['#3498DB', '#2ECC71', '#F1C40F'];

  return (
    <div className="container-fluid p-4" style={{ marginTop: '75px', width: '90vw' }}>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-subtitle text-muted">BUDGET</h6>
                <div className="bg-primary rounded-circle p-2 text-white">$</div>
              </div>
              <h2 className="card-title mb-0">$24k</h2>
              <small className="text-success">↑ 12% Since last month</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-subtitle text-muted">TOTAL CUSTOMERS</h6>
                <div className="bg-success rounded-circle p-2 text-white">👥</div>
              </div>
              <h2 className="card-title mb-0">1.6k</h2>
              <small className="text-danger">↓ 16% Since last month</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-subtitle text-muted">TASK PROGRESS</h6>
                <div className="bg-warning rounded-circle p-2 text-white">≡</div>
              </div>
              <h2 className="card-title mb-0">75.5%</h2>
              <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width: '75.5%'}} aria-valuenow="75.5" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-subtitle text-muted">TOTAL PROFIT</h6>
                <div className="bg-info rounded-circle p-2 text-white">💼</div>
              </div>
              <h2 className="card-title">$15k</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title">Sales</h5>
                <button className="btn btn-sm btn-outline-secondary">↻ Sync</button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <Bar dataKey="value" fill="#3498DB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Traffic source</h5>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="d-flex justify-content-around mt-3">
                <small>💻 Desktop: 63%</small>
                <small>📱 Tablet: 15%</small>
                <small>📱 Phone: 22%</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title">Latest products</h5>
                <a href="#" className="text-decoration-none">View all →</a>
              </div>
              <ul className="list-group list-group-flush">
                {products.map((product, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{product.name}</h6>
                      <small className="text-muted">Updated {product.updated}</small>
                    </div>
                    <button className="btn btn-sm btn-light">⋮</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title">Latest orders</h5>
                <a href="#" className="text-decoration-none">View all →</a>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>
                          <span className={`badge ${order.status === 'Pending' ? 'bg-warning' : order.status === 'Delivered' ? 'bg-success' : 'bg-danger'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;