import Head from 'next/head';
import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  function calcTimeReading(): number {
    return post.data.content.reduce((_acc, actual) => {
      const elements = `${actual.heading} ${RichText.asHtml(actual.body)}`;
      const calcTime = Math.ceil(elements.split(' ').length / 150);
      return calcTime;
    }, 0);
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | Spacetraveling</title>
      </Head>

      <main className={commonStyles.maxWidthContainer}>
        <img
          className={styles.banner}
          src={post.data.banner.url}
          alt={`banner ${post.data.title}`}
        />
        <article className={`${styles.post} ${commonStyles.maxWidthContent}`}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.postsInfo}>
            <time>
              <FiCalendar />
              {format(new Date(post.first_publication_date), 'd LLL yyyy', {
                locale: ptBR,
              })}
            </time>
            <span>
              <FiUser />
              {post.data.author}
            </span>
            <span>
              <FiClock />
              {calcTimeReading()} min
            </span>
          </div>
          <div className={styles.articlePost}>
            {post.data.content.map(elem => (
              <article key={elem.heading}>
                <h2>{elem.heading}</h2>
                <div
                  className={styles.contentPost}
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(elem.body),
                  }}
                />
              </article>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'post'),
  ]);

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  // console.log(response);

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(elem => ({
        heading: elem.heading,
        body: [...elem.body],
      })),
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 min
  };
};
