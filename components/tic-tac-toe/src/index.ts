import { ComponentSettings, Manager } from "@managed-components/types";
import * as fs from "fs/promises";
import widgetHTML from "./assets/widget.html";
import { parseJsonBody } from "./parser";

const WIDGET_NAME = "tic-tac-toe"

interface Payload {
  state: number[]
  type: number // Cross (1) or circle (-1)
}

export default async function (manager: Manager, _settings: ComponentSettings) {

  const path = manager.serve('/public', 'public');
  console.log(`Serving public files under ${path}`);

  manager.route("/next-move", async (request) => {
    const body = await parseJsonBody<Payload>(request);

    const response = await manager.fetch("https://tic-tac-toe.m-wassim-benzarti.workers.dev/", {
      method: "POST",
      body: JSON.stringify({ state: body.state }),
    });
    if (!response) {
      return new Response(null, { status: 500 });
    }
    const nextMove = await response.json()
    return Response.json(nextMove)
  })

  manager.registerWidget(async () => {
    const widget = manager.useCache(`${WIDGET_NAME}-widget`, async () => {
      const widget = (await fs.readFile(`${__dirname}/${widgetHTML}`)).toString();
      return widget
    }, 1)
    return widget
  })
}
