import { Liquid } from "liquidjs"
import type { Engine } from "../types"

export const liquid: Engine = {
  name: "liquid",
  render: (content, variables) => new Liquid().parseAndRender(content, variables),
}

export default liquid
