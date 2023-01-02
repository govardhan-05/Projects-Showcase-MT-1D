import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectsShowCase from './components/ProjectsShowCase'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './App.css'
// import {each} from 'immer/dist/internal'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {dataList: [], api: apiStatus.initial, select: categoriesList[0].id}

  componentDidMount() {
    this.getData()
  }

  onSelect = event => {
    this.setState({select: event.target.value}, () => this.getData())
  }

  getData = async () => {
    this.setState({api: apiStatus.inProgress})
    const {select} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${select}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updateData = data.projects.map(item => ({
        id: item.id,
        name: item.name,
        imageUrl: item.image_url,
      }))
      this.setState({dataList: updateData, api: apiStatus.success})
    } else {
      this.setState({api: apiStatus.failure})
    }
  }

  onClickRetry = () => {
    this.getData()
  }

  failureView = () => (
    <div className="fail-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="paragraph">
        We cannot seem to find the page you are looking for
      </p>
      <button className="btn" type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  loadingView = () => (
    <div
      className="loading-container"
      // testid="loader"
    >
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {dataList} = this.state
    return (
      <div className="success-container">
        <ul className="app-container">
          {dataList.map(item => (
            <ProjectsShowCase details={item} key={item.id} />
          ))}
        </ul>
      </div>
    )
  }

  finalRender = () => {
    const {api} = this.state
    switch (api) {
      case apiStatus.inProgress:
        return this.loadingView()
      case apiStatus.success:
        return this.successView()
      case apiStatus.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {select} = this.state
    return (
      <>
        <nav className="nav-el">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="website-logo"
            alt="website logo"
          />
        </nav>
        <div className="main-container">
          <ul className="select-icon">
            <select className="select" value={select} onChange={this.onSelect}>
              {categoriesList.map(item => (
                <option value={item.id} key={item.id}>
                  {item.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.finalRender()}
        </div>
      </>
    )
  }
}

export default App
