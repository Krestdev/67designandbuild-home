import JsonView from "@uiw/react-json-view";

const JsonViewer = ({ json }: { json: any }) => {
  return <JsonView value={json} />;
};

export default JsonViewer;
