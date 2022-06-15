import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import Tags from "../../components/Tags";
import dateFormat from "dateformat";

export default function Post({ frontmatter, content, date, slug }) {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <Tags
        title={frontmatter.title}
        desc={
          md()
            .render(content)
            .replace(/<[^>]+>/g, "")
            .slice(0, 157) + "..."
        }
        image={frontmatter.previewImg}
        slug={"/blog/" + slug}
      />
      <div className="container px-5">
        <h1 className="text-8xl md:text-8xl font-bold">
          {frontmatter.title.toUpperCase()}
        </h1>
        <p className="text-2xl pb-2">
          by: {frontmatter.author}, {dateFormat(date, "m mmm, yyyy")}
        </p>
        <hr />
        <div
          className="pt-2 article"
          dangerouslySetInnerHTML={{ __html: md().render(content) }}
        />
      </div>
    </div>
  );
}

export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`blog/${slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
      slug,
    },
  };
}

export async function getStaticPaths() {
  const files = fs.readdirSync("blog");

  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
