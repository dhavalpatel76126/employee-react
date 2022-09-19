import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";

export default function List() {
  const [employees, setEmployees] = useState([]);
  const [query, setquery] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    await axios.get(`http://localhost:8000/api/employee`).then(({ data }) => {
      setEmployees(data);
    });
  };

  const deleteEmployee = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      return result.isConfirmed;
    });

    if (!isConfirm) {
      return;
    }

    await axios
      .delete(`http://localhost:8000/api/employee/${id}`)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        fetchEmployees();
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        });
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Link
            className="btn btn-primary mb-2 float-end"
            to={"/employee/create"}
          >
            Create Employee
          </Link>
        </div>
        <div className="row">
          <div className="form-outline my-3">
            <input
              type="search"
              id="form1"
              className="form-control search"
              placeholder="Search...."
              aria-label="Search"
              onChange={(e) => setquery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="card card-body">
            <div className="table-responsive">
              <table className="table table-bordered mb-0 text-center">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 &&
                    employees
                      .filter(
                        (emp) =>
                          emp.name.toLowerCase().includes(query) ||
                          emp.email.toLowerCase().includes(query)
                      )
                      .map((row, key) => (
                        <tr key={key}>
                          <td>{row.name}</td>
                          <td>{row.email}</td>
                          <td>{row.age}</td>
                          <td>
                            <img
                              width="50px"
                              src={`http://localhost:8000/storage/employee/image/${row.image}`}
                              alt={key}
                            />
                          </td>
                          <td>
                            <Link
                              to={`/employee/edit/${row.id}`}
                              className="btn btn-success me-2"
                            >
                              Edit
                            </Link>
                            <Button
                              variant="danger"
                              onClick={() => deleteEmployee(row.id)}
                            >
                              Delete
                            </Button>
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
  );
}
