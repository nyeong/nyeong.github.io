const path = require(`path`)
const { exec } = require("child_process")
const { createFilePath } = require(`gatsby-source-filesystem`)

const execute = job =>
  new Promise((resolve, reject) =>
    exec(job, (err, stdout, stderr) => {
      if (err) reject(stderr)
      resolve(stdout.trimRight())
    })
  )

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [fields___slug], order: ASC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
                categorySlug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges
  const postsByCategories = (posts => {
    const postsByCategories = new Map()
    posts.forEach(({ node }) => {
      const categorySlug = node.fields.categorySlug
      const posts = postsByCategories.get(categorySlug)
      if (posts) posts.push(node)
      else postsByCategories.set(categorySlug, [node])
    })
    return postsByCategories
  })(posts)

  postsByCategories.forEach(posts => {
    posts.forEach((post, index) => {
      const previous = index === 0 ? null : posts[index - 1]
      const next = index === posts.length - 1 ? null : posts[index + 1]

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          slug: post.fields.slug,
          categorySlug: post.fields.categorySlug,
          previous,
          next,
        },
      })
    })
  })
}

exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const parentNode = getNode(node.parent)
    const { absolutePath, relativePath, relativeDirectory } = parentNode

    const isCategory = relativePath.endsWith("README.md")
    const categorySlug = relativeDirectory
    const updatedAt = await execute(
      `git log --pretty=format:%aI -- ${absolutePath} | sort | tail -n 1`
    )
    const createdAt =
      node.frontmatter.date ||
      (await execute(
        `git log --pretty=format:%aI -- ${absolutePath} | sort -r | tail -n 1`
      ))
    const slug = (slug => (isCategory ? slug.replace("README/", "") : slug))(
      createFilePath({ node, getNode })
    )

    createNodeField({ name: "slug", node, value: slug })
    createNodeField({ name: "updatedAt", node, value: updatedAt })
    createNodeField({ name: "createdAt", node, value: createdAt })
    createNodeField({ name: "isCategory", node, value: isCategory })
    createNodeField({ name: "categorySlug", node, value: categorySlug })
  }
}
