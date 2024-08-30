import "./Home.scss"
import SideBar from "../../components/SideBar/SideBar"
import Slide from "../../components/Slide/Slide"

const Home = () => {
  return (
    <div className="home_container">
      <SideBar/>
      <Slide/>
    </div>
  )
}

export default Home
