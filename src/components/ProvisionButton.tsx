import * as React from "react";
import AceEditor from "react-ace";
import * as Modal from "react-modal";
import { RouterAction } from "react-router-redux";
import { IServiceClass, IServicePlan } from "../shared/ServiceCatalog";

import "brace/mode/json";
import "brace/theme/xcode";

interface IProvisionButtonProps {
  plans: IServicePlan[];
  classes: IServiceClass[];
  provision: (releaseName: string, namespace: string) => Promise<{}>; // , plans: IServicePlan, classes: IServiceClass, parameters: string
  push: (location: string) => RouterAction;
}

interface IProvisionButtonState {
  isProvisioning: boolean;
  modalIsOpen: boolean;
  // deployment options
  releaseName: string;
  namespace: string;
  plan: IServicePlan;
  class: IServiceClass;
  parameters: string;
  error: string | null;
}

class ProvisionButton extends React.Component<IProvisionButtonProps, IProvisionButtonState> {
  public state: IProvisionButtonState;
  //  = {
  //   class: ,
  //   error: null,
  //   isProvisioning: false,
  //   modalIsOpen: false,
  //   namespace: "default",
  //   parameters: "",
  //   plan: null,
  //   releaseName: "",
  // };

  public render() {
    const { plans, classes } = this.props;
    return (
      <div className="ProvisionButton">
        {this.state.isProvisioning && <div>Provisioning...</div>}
        <button
          className="button button-primary"
          onClick={this.openModel}
          disabled={this.state.isProvisioning}
        >
          Provision
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Modal"
        >
          {this.state.error && (
            <div className="container padding-v-bigger bg-action">{this.state.error}</div>
          )}
          <form onSubmit={this.handleProvision}>
            <div>
              <label htmlFor="releaseName">Name</label>
              <input
                id="releaseName"
                onChange={this.handleReleaseNameChange}
                value={this.state.releaseName}
                required={true}
              />
            </div>
            <div>
              <label htmlFor="namespace">Namespace</label>
              <input
                name="namespace"
                onChange={this.handleNamespaceChange}
                value={this.state.namespace}
              />
            </div>
            <div>
              <label htmlFor="classes">Classes</label>
              <select>
                <option>Test Class</option>
                {classes.map(c => <option key={c.spec.externalName} />)}
              </select>
            </div>
            <div>
              <label htmlFor="plans">Plans</label>
              <select>
                <option>Test Plan</option>
                {plans.map(p => <option key={p.spec.externalName} />)}
              </select>
            </div>
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="values">Parameters</label>
              <AceEditor
                mode="json"
                theme="xcode"
                name="values"
                width="100%"
                height="200px"
                onChange={this.handleParametersChange}
                setOptions={{ showPrintMargin: false }}
                value={this.state.parameters}
              />
            </div>
            <div>
              <button className="button button-primary" type="submit">
                Submit
              </button>
              <button className="button" onClick={this.closeModal}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  public openModel = () => {
    this.setState({
      modalIsOpen: true,
    });
  };

  public closeModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  };

  public handleProvision = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { provision, push } = this.props;
    this.setState({ isProvisioning: true });
    const { releaseName, namespace } = this.state;
    provision(releaseName, namespace)
      .then(() => push(`/services`))
      .catch(err => this.setState({ isProvisioning: false, error: err.toString() }));
  };

  public handleReleaseNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ releaseName: e.currentTarget.value });
  };
  public handleNamespaceChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ namespace: e.currentTarget.value });
  };
  public handleParametersChange = (parameter: string) => {
    this.setState({ parameters: parameter });
  };
}

export default ProvisionButton;