import { AsyncFlow, AsyncNode } from "@fractal-solutions/qflow";
import { InteractiveInputNode, TransformNode, SystemNotificationNode } from "@fractal-solutions/qflow/nodes";

export function textInputWorkflow() {
  const textInputNode = {
    ...new InteractiveInputNode(),
    async prepAsync(shared, prepRes) {
      this.setParams({
        prompt: "Enter a title for the notification:",
      });
    },
    async postAsync(shared, prepRes, execRes) {
      shared.notificationTitle = execRes;
    }
  };

  const transformNode = {
    ...new TransformNode(),
    async prepAsync(shared, prepRes) {
      this.setParams({
        input: shared.notificationTitle,
        transformFunction: '(data) => `This is a notification with the title: ${data}`'
      });
    },
    async postAsync(shared, prepRes, execRes) {
      shared.notificationMessage = execRes;
    }
  };

  const systemNotificationNode = {
    ...new SystemNotificationNode(),
    async prepAsync(shared, prepRes) {
      this.setParams({
        title: shared.notificationTitle,
        message: shared.notificationMessage,
      });
    }
  };

  const flow = new AsyncFlow();

  flow
    .start(textInputNode)
    .next(transformNode)
    .next(systemNotificationNode);

  return flow;
}
