import React, { Component } from "react";
import ReactDOM from 'react-dom'
import { API, Storage } from "aws-amplify";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/styles/prism';

export default class Job extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      job: null,
      stdoutText: "",
      stdout: "",
      width: 0,
      height: 0,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  async componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    try {
      let stdoutText;
      const job = await this.getJob();
      const { stdout } = job;

      if (stdout) {
        console.log(stdout);
        await Storage.vault.get(stdout, {download: true})
        .then(result => {
          stdoutText = decodeURIComponent(escape(result.Body));
          console.log(stdoutText);
        })
      }

      this.setState({
        job,
        stdoutText,
        stdout
      });
    } catch (e) {
      alert(e);
    }

    var element = document.getElementById("test");
    element.scrollTop = element.scrollHeight;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  getJob() {
    return API.get("jobs", `/jobs/${this.props.match.params.id}`);
  }

  render() {
    return (
      <div className="Job">
        {this.state.job &&
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <h2>Command: {this.state.job.command}</h2>
            <h3>Job Status: {this.state.job.jobStatus}</h3>
            <h3>Runtime: {this.state.job.runtime}</h3>
            <hr />
            <p>Machine: {this.state.job.machine}</p>
            <p>Date Created: {this.state.job.dateCreated}</p>
            <p>Date Modified: {this.state.job.dateModified}</p>
            <hr />
            <h4>Standard Out:</h4>
            <SyntaxHighlighter language='less' id='test' style={atomDark} customStyle={{fontSize: 16,
              maxHeight: this.state.height / 2, overflow: 'auto'}}>
              {this.state.stdoutText}
            </SyntaxHighlighter>
          </div>
        }
      </div>
    );
  }
}
