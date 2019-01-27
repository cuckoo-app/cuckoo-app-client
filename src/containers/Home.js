import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      jobs: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const jobs = await this.jobs();
      this.setState({ jobs });
      console.log(jobs)
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  shouldComponentUpdate(nextProps) {
    return true
  }

  jobs() {
    return API.get("jobs", "/jobs");
  }

  renderJobsList(jobs) {
    return jobs.map(
      (job, i) =>
        <LinkContainer
          key={job.jobId}
          to={`/jobs/${job.jobId}`}
        >
          <ListGroupItem header={job.command.trim().split("\n")[0]}>
            {"Created: " + new Date(job.dateCreated).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Cuckoo</h1>
        <p>Easily track the progress of your command line jobs</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderJobs() {
    return (
      <div className="jobs">
        <PageHeader>My Jobs</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderJobsList(this.state.jobs)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderJobs() : this.renderLander()}
      </div>
    );
  }
}
