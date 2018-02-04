import * as React from "react";
import { RouterAction } from "react-router-redux";

import { IServiceClass, IServicePlan } from "../shared/ServiceCatalog";
import { Card, CardContainer } from "./Card";
import ProvisionButton from "./ProvisionButton";

interface IClassViewProps {
  classes: IServiceClass[];
  classname: string;
  getCatalog: () => Promise<any>;
  plans: IServicePlan[];
  provision: (
    instanceName: string,
    namespace: string,
    className: string,
    planName: string,
    parameters: {},
  ) => Promise<any>;
  push: (location: string) => RouterAction;
  svcClass: IServiceClass | null;
}

export class ClassView extends React.Component<IClassViewProps> {
  public componentDidMount() {
    this.props.getCatalog();
  }

  public render() {
    const { classes, classname, plans, provision, push, svcClass } = this.props;
    const classPlans = svcClass
      ? plans.filter(plan => plan.spec.clusterServiceClassRef.name === svcClass.metadata.name)
      : [];

    return (
      <div className="class-view">
        <h3>Plans: {classname}</h3>
        <p>Service Plans available for provisioning under {classname}</p>
        <CardContainer>
          {svcClass &&
            classPlans.map(plan => {
              const serviceClass = classes.find(
                potential => potential.metadata.name === plan.spec.clusterServiceClassRef.name,
              );
              const free = plan.spec.free ? <span>Free ✓</span> : null;
              const card = (
                <Card
                  key={plan.spec.externalID}
                  header={plan.spec.externalName}
                  body={plan.spec.description}
                  notes={free}
                  button={
                    <ProvisionButton
                      selectedClass={serviceClass}
                      selectedPlan={plan}
                      plans={plans}
                      classes={classes}
                      provision={provision}
                      push={push}
                    />
                  }
                />
              );
              return card;
            })}
        </CardContainer>
      </div>
    );
  }
}
