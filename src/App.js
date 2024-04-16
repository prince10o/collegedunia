import React, { useState, useEffect } from "react";
import "./App.css";
import jsonData from "./colleges.json";

function App() {
  const [colleges, setColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [selectedColleges, setSelectedColleges] = useState([]);

  useEffect(() => {
    setColleges(jsonData.colleges);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setStartIndex(0);
    setEndIndex(10);
  };

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  const handleCompareFees = (college) => {
    console.log(`College ${college.name}: Compare fees checkbox clicked`);
  };

  const sortColleges = () => {
    let sortedColleges = [...colleges];
    if (sortBy) {
      sortedColleges.sort((a, b) => {
        let comparison = a[sortBy] - b[sortBy];
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }
    return sortedColleges;
  };

  const renderRows = () => {
    const sortedColleges = sortColleges();
    return sortedColleges
      .filter((college) =>
        college.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(startIndex, endIndex)
      .map((college, index) => (
        <tr key={index}>
          <td>
            {college.featured && <div className="featured-tag">Featured</div>}
            <div className="college-info">
              <div>
                <h3>{college.name}</h3>
                <p>
                  {college.district}, {college.state}
                </p>
                <p>
                  {college.aicte_approved
                    ? "AICTE Approved"
                    : "Not AICTE Approved"}
                </p>
              </div>
              <div className="actions">
                <a
                  href={college.apply_now_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </a>
                <a
                  href={college.brochure_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Brochure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </a>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(college)}
                />{" "}
                Add to Compare
              </div>
            </div>
          </td>
          <td>
            <div className="fees-wrapper">
              <span className="fees">{college.fees}</span>
              <div className="compare-fees">
                <input
                  type="checkbox"
                  onChange={() => handleCompareFees(college)}
                />{" "}
                Compare fees
              </div>
            </div>
          </td>
          <td>{college.placement}</td>
          <td>{college.rating}</td>
          <td>{college.user_review_rating}</td>
        </tr>
      ));
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setEndIndex((prevEndIndex) => prevEndIndex + 10);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCheckboxChange = (college) => {
    if (selectedColleges.includes(college)) {
      setSelectedColleges(selectedColleges.filter((c) => c !== college));
    } else {
      setSelectedColleges([...selectedColleges, college]);
    }
  };

  return (
    <div className="App">
      <h1>Indian Colleges</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by college name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>College Name</th>
            <th onClick={() => handleSort("fees")}>Course-Fees</th>
            <th onClick={() => handleSort("placement")}>Placement</th>
            <th onClick={() => handleSort("rating")}>User-Reviews</th>
            <th onClick={() => handleSort("user_review_rating")}>Ranking</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
}

export default App;
