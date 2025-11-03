import { AsyncFlow } from "@fractal-solutions/qflow";
import { InteractiveInputNode, TransformNode, SystemNotificationNode } from "@fractal-solutions/qflow/nodes";

class TitleInputNode extends InteractiveInputNode {
  constructor() {
    super();
    this.setParams({
      prompt: "Enter a title for the notification:",
    });
  }

  async postAsync(shared, prepRes, execRes) {
    shared.notificationTitle = execRes;
  }
}

class MessageTransformNode extends TransformNode {
  async prepAsync(shared, prepRes) {
    this.setParams({
      input: shared.notificationTitle,
      transformFunction: '(data) => `This is a notification with the title: ${data}`'
    });
  }

  async postAsync(shared, prepRes, execRes) {
    shared.notificationMessage = execRes;
  }
}

class NotificationSenderNode extends SystemNotificationNode {
  async prepAsync(shared, prepRes) {
    this.setParams({
      title: shared.notificationTitle,
      message: shared.notificationMessage,
    });
  }
}

export function textInputWorkflow() {
  const flow = new AsyncFlow();

  flow
    .start(new TitleInputNode())
    .next(new MessageTransformNode())
    .next(new NotificationSenderNode());

  return flow;
}
