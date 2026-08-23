import Handlebars from "handlebars"
import type { Engine } from "../types"

export const handlebars: Engine = {
  name: "handlebars",
  render: (content, variables) => Handlebars.compile(content)(variables),
}

export default handlebars
