import * as React from "react";
import { Link } from "react-router-dom";

import {
  IServiceBinding,
  IServiceBroker,
  IServiceClass,
  IServiceInstance,
  IServicePlan,
} from "../shared/ServiceCatalog";
import { Card, CardContainer } from "./Card";
import SyncButton from "./SyncButton";

interface IBrokerViewProps {
  bindings: IServiceBinding[];
  broker: IServiceBroker | null;
  classes: IServiceClass[];
  getCatalog: () => Promise<any>;
  instances: IServiceInstance[];
  plans: IServicePlan[];
  sync: (broker: IServiceBroker) => Promise<any>;
}

export class BrokerView extends React.PureComponent<IBrokerViewProps> {
  public async componentDidMount() {
    this.props.getCatalog();
  }

  public render() {
    const { bindings, broker, plans, classes, instances } = this.props;
    const classesIndexedByName = classes.reduce<{ [key: string]: IServiceClass }>(
      (carry, serviceClass) => {
        const { name } = serviceClass.metadata;
        carry[name] = serviceClass;
        return carry;
      },
      {},
    );

    const plansIndexedByClassName = plans.reduce<{ [key: string]: IServicePlan[] }>(
      (carry, plan) => {
        const className = plan.spec.clusterServiceClassRef.name;
        const svcClass = classes.find(cls => cls.metadata.name === className);

        // ServiceClasses may not have been retreived yet
        if (svcClass) {
          const svcClassExternalName = svcClass.spec.externalName;
          if (!carry[svcClassExternalName]) {
            carry[svcClassExternalName] = [];
          }
          carry[svcClassExternalName].push(plan);
        }
        return carry;
      },
      {},
    );

    return (
      <div className="broker">
        {broker && (
          <div>
            <h1>{broker.metadata.name}</h1>
            <div>Catalog last updated at {broker.status.lastCatalogRetrievalTime}</div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Link to={window.location.pathname + "/classes"}>
                <button className="button button-primary">Provision New Service</button>
              </Link>
              <SyncButton sync={this.props.sync} broker={broker} />
            </div>
            <h3>Service Instances</h3>
            <p>Most recent statuses for your brokers:</p>
            <table>
              <thead>
                <tr>
                  <th>Instance</th>
                  <th>Status</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {instances.map(instance => {
                  const conditions = [...instance.status.conditions];
                  const status = conditions.shift(); // first in list is most recent
                  const reason = status ? status.reason : "";
                  const message = status ? status.message : "";
                  const statusText = status ? (
                    <code>{`${status.type} : ${status.status}`}</code>
                  ) : (
                    ""
                  );
                  return (
                    <tr key={instance.metadata.uid}>
                      <td key={instance.metadata.name}>
                        <strong>
                          {instance.metadata.namespace}/{instance.metadata.name}
                        </strong>
                      </td>
                      <td key={reason}>
                        <code>{reason}</code>
                      </td>
                      <td key={message}>
                        <code>{message}</code>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <h3>Bindings</h3>
            <CardContainer>
              {bindings.length > 0 &&
                bindings.map(binding => {
                  const {
                    instanceRef,
                    secretName,
                    secretDatabase,
                    secretHost,
                    secretPassword,
                    secretPort,
                    secretUsername,
                  } = binding.spec;
                  const statuses: Array<[string, string]> = [
                    ["Instance", instanceRef.name],
                    ["Secret", secretName],
                    ["Database", secretDatabase],
                    ["Host", secretHost],
                    ["Password", secretPassword],
                    ["Port", secretPort],
                    ["Username", secretUsername],
                  ];
                  const body = (
                    <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                      {statuses.map(statusPair => {
                        const [key, value] = statusPair;
                        return (
                          <div key={key} style={{ display: "flex" }}>
                            <strong key={key} style={{ flex: "0 0 5em" }}>
                              {key}:
                            </strong>
                            <code key={value} style={{ flex: "1 1", wordBreak: "break-all" }}>
                              {value}
                            </code>
                          </div>
                        );
                      })}
                    </div>
                  );
                  const card = (
                    <Card
                      key={binding.metadata.name}
                      header={binding.metadata.name}
                      body={body}
                      button={<span />}
                    />
                  );
                  return card;
                })}
            </CardContainer>
          </div>
        )}
      </div>
    );
  }
}