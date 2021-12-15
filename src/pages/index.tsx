import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>

      <main>
        <div>
          <a href="http://google.com">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <time>
              <FiCalendar />
              15 Mar 2021
            </time>
            <span>
              <FiUser />
              Joseph Oliveira
            </span>
          </a>
          <a href="http://google.com">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <time>
              <FiCalendar />
              15 Mar 2021
            </time>
            <span>
              <FiUser />
              Joseph Oliveira
            </span>
          </a>
          <button type="button">Carregar mais posts</button>
        </div>
      </main>
    </>
  );
}

/* export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 20,
    }
  );

  console.log(postsResponse);

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      subtitle: post.data
    }
  })

  return {
    props: {},
  };
}; */
