import React from "react"
import {
  Container,
} from "reactstrap"

const Dashboard = props => {

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <h3>Dashboard</h3>

        </Container>
      </div>
    </React.Fragment>
  )
}
export default Dashboard;