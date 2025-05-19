import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  UserPlus,
  User,
  Briefcase,
  Building,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Badge,
  Spinner,
  Dropdown,
  DropdownButton,
  ListGroup,
  Modal,
  Container,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import themeColors from "../../theme/colors";
import { getAllEmployees } from "../../services/api";
// import female from "../../assets/female.png";

const TeamMembers = () => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const fontStyles = {
    fontFamily: "'Open Sans', sans-serif",
    color: "#000",
  };
  // Load team members data
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await getAllEmployees();
        const employees = response.data.employees || [];
        setTeamMembers(employees);
        setFilteredMembers(employees);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team members:", error);
        toast.error("Failed to load team members");
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  // Filter team members based on search term and filters
  useEffect(() => {
    let result = teamMembers;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply department filter
    if (filterDepartment !== "All") {
      result = result.filter(
        (member) => member.department === filterDepartment
      );
    }

    // Apply status filter
    if (filterStatus !== "All") {
      result = result.filter((member) => member.status === filterStatus);
    }

    setFilteredMembers(result);
  }, [teamMembers, searchTerm, filterDepartment, filterStatus]);

  // Get unique departments for filter dropdown
  const departments = [
    "All",
    ...new Set(teamMembers.map((member) => member.department)),
  ];

  // Get unique statuses for filter dropdown
  const statuses = [
    "All",
    ...new Set(teamMembers.map((member) => member.status)),
  ];

  // Handle member card click
  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  // Close member modal
  const handleCloseModal = () => {
    setShowMemberModal(false);
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <Spinner animation="border" style={{ color: themeColors.secondary }} />
      </div>
    );
  }

  return (
    <Container fluid className="px-0" style={fontStyles}>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 teams">
        <h2
          className="fw-bold"
          style={{
            color: themeColors.primary,
            padding: "5px 0",
            fontWeight: 600,
          }}
        >
          Team Members
        </h2>

        <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
          <InputGroup style={{ maxWidth: "300px" }}>
            <InputGroup.Text
              style={{ background: "white", borderRight: "none" }}
            >
              <Search size={18} color={themeColors.lightText} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderLeft: "none" }}
            />
          </InputGroup>

          <DropdownButton
            variant="light"
            title={
              <div className="d-flex align-items-center">
                <Building size={16} className="me-2" />
                <span>{filterDepartment}</span>
              </div>
            }
            style={{ borderColor: themeColors.border }}
          >
            {departments.map((dept) => (
              <Dropdown.Item
                key={dept}
                active={filterDepartment === dept}
                onClick={() => setFilterDepartment(dept)}
              >
                {dept}
              </Dropdown.Item>
            ))}
          </DropdownButton>

          <DropdownButton
            variant="light"
            title={
              <div className="d-flex align-items-center">
                <Clock size={16} className="me-2" />
                <span>{filterStatus}</span>
              </div>
            }
            style={{ borderColor: themeColors.border }}
          >
            {statuses.map((status) => (
              <Dropdown.Item
                key={status}
                active={filterStatus === status}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>

        <div className="container">
          {filteredMembers.length === 0 ? (
            <Card className="shadow-sm text-center p-5">
              <Card.Body>
                <AlertCircle
                  size={48}
                  className="mb-3"
                  style={{ color: themeColors.lightText }}
                />
                <h5>No team members found</h5>
                <p className="text-muted">
                  Try adjusting your search or filters
                </p>
              </Card.Body>
            </Card>
          ) : (
            <div className="container">
              <div className="d-flex gap-2 flex-wrap">
                {filteredMembers.map((member) => (
                  <Col key={member._id} lg={4} md={6} sm={12}>
                    <Card
                      className="shadow-sm h-100 border-0"
                      style={{
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      onClick={() => handleMemberClick(member)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 20px rgba(0, 0, 0, 0.1)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                      }}
                    >
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex align-items-center mb-3">
                          {/* <img
                            src={female}
                            alt={member.name}
                            className="rounded-circle me-3"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              border: `2px solid ${themeColors.secondary}`,
                            }}
                          /> */}
                          <div>
                            <h5
                              className="mb-1"
                              style={{
                                fontWeight: 600,
                                color: themeColors.darkText,
                              }}
                            >
                              {member.name}
                            </h5>
                            <p
                              className="mb-0"
                              style={{
                                color: themeColors.secondary,
                                fontWeight: 500,
                              }}
                            >
                              {member.department}
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <User
                            size={16}
                            className="me-2"
                            style={{ color: themeColors.lightText }}
                          />
                          <span style={{ color: themeColors.darkText }}>
                            {member.email}
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <Clock
                            size={16}
                            className="me-2"
                            style={{ color: themeColors.lightText }}
                          />
                          <span style={{ color: themeColors.darkText }}>
                            {member.dob
                              ? new Date(member.dob).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Member Details Modal */}
        <Modal show={showMemberModal} onHide={handleCloseModal} centered>
          <Modal.Header
            closeButton
            style={{ borderBottom: `1px solid ${themeColors.border}` }}
          >
            <Modal.Title
              style={{ color: themeColors.darkText, fontWeight: 600 }}
            >
              Team Member Details
            </Modal.Title>
          </Modal.Header>
          {selectedMember && (
            <Modal.Body>
              <div className="text-center mb-4">
                <img
                  src={
                    selectedMember.profilePhoto &&
                    selectedMember.profilePhoto !== "default-profile.jpg"
                      ? `${process.env.REACT_APP_BACKEND_URL}/${selectedMember.profilePhoto}`
                      : "/default-profile.png"
                  }
                  alt={selectedMember.name}
                  className="rounded-circle mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    border: `3px solid ${themeColors.secondary}`,
                  }}
                />
                <h4 style={{ color: themeColors.darkText, fontWeight: 600 }}>
                  {selectedMember.name}
                </h4>
                <p className="mb-1" style={{ color: themeColors.secondary }}>
                  {selectedMember.department}
                </p>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex align-items-center py-3">
                  <User
                    size={18}
                    className="me-3"
                    style={{ color: themeColors.secondary }}
                  />
                  <div>
                    <p className="mb-0 small text-muted">Email</p>
                    <p className="mb-0" style={{ fontWeight: 500 }}>
                      {selectedMember.email}
                    </p>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center py-3">
                  <Building
                    size={18}
                    className="me-3"
                    style={{ color: themeColors.secondary }}
                  />
                  <div>
                    <p className="mb-0 small text-muted">Department</p>
                    <p className="mb-0" style={{ fontWeight: 500 }}>
                      {selectedMember.department}
                    </p>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center py-3">
                  <Clock
                    size={18}
                    className="me-3"
                    style={{ color: themeColors.secondary }}
                  />
                  <div>
                    <p className="mb-0 small text-muted">Date of Birth</p>
                    <p className="mb-0" style={{ fontWeight: 500 }}>
                      {selectedMember.dob
                        ? new Date(selectedMember.dob).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Modal.Body>
          )}
          <Modal.Footer>
            <Button
              variant="light"
              onClick={handleCloseModal}
              style={{ borderColor: "#dee2e6" }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default TeamMembers;
