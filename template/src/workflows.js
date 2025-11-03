import { AsyncFlow } from "@fractal-solutions/qflow";
import { InteractiveInputNode, TransformNode, SystemNotificationNode } from "@fractal-solutions/qflow/nodes";

export function textInputWorkflow() {
  const textInputNode = new InteractiveInputNode();
  textInputNode.setParams({
    prompt: "Enter a title for the notification:",
  });
  textInputNode.postAsync = async (shared, prepRes, execRes) => {
    shared.notificationTitle = execRes;
  };

  const transformNode = new TransformNode();
  transformNode.prepAsync = async (shared, prepRes) => {
    transformNode.setParams({
      input: shared.notificationTitle,
      transformFunction: '(data) => `This is a notification with the title: ${data}`'
    });
  };
  transformNode.postAsync = async (shared, prepRes, execRes) => {
    shared.notificationMessage = execRes;
  };

  const systemNotificationNode = new SystemNotificationNode();
  systemNotificationNode.prepAsync = async (shared, prepRes) => {
    systemNotificationNode.setParams({
      title: shared.notificationTitle,
      message: shared.notificationMessage,
    });
  };

  const flow = new AsyncFlow();

  flow
    .start(textInputNode)
    .next(transformNode)
    .next(systemNotificationNode);

  return flow;
}
