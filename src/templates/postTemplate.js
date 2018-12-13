import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout";
import { connect } from 'react-redux'
import { onSidebarContentExpand } from '../actions/layout'
import "katex/dist/katex.min.css"

function Template({
  data, // this prop will be injected by the GraphQL query below.
  onSidebarContentExpand,
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html, id } = markdownRemark
  onSidebarContentExpand(id)
  return (
    <Layout>
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h5>{frontmatter.date}</h5>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
    </Layout>
  )
}

const mapDispatchToProps = {
  onSidebarContentExpand,
}

export default connect(()=>({}), mapDispatchToProps) (Template)

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(fields: { slug: { eq: $path} }) {
      fields {
        slug
      }
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
      }
    }
  }
`