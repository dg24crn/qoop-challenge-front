import MainContent from "../../components/dashboard/MainContent"
import ProjectDetails from "../project/ProjectDetails"

const Sandbox = () => {
  return (
    <div>
        <h1 className="border text-4xl text-center p-4">This is the Sandbox View</h1>
        console.log(import.meta.env.VITE_BACKEND_URL)
    </div>
  )
}

export default Sandbox