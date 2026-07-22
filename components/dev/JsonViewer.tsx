import JsonView from "@uiw/react-json-view";

const JsonViewer = ({ json }: { json: object }) => {
  return <JsonView value={json} />;
};

export default JsonViewer;
