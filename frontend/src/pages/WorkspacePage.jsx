import { useParams } from "react-router-dom";
import Workspace from "./Workspace/Workspace";

export default function WorkspacePage() {
    const { templateId } = useParams();

    return <Workspace templateId={templateId} />;
}