import './index.css'

const ProjectsShowCase = props => {
  const {details} = props
  const {name, imageUrl} = details
  return (
    <li className="applications-list">
      <img src={imageUrl} className="image" alt={name} />
      <p className="para">{name}</p>
    </li>
  )
}

export default ProjectsShowCase
