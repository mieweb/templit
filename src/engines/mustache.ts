import Mustache from "mustache"
import type { Engine } from "../types"

export const mustache: Engine = {
  name: "mustache",
  render: (content, variables) => Mustache.render(content, variables),
}

export default mustache
