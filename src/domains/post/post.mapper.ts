import * as DTO from './post.dto';
import * as Type from './post.type';

export const jobNameKorean2JobNameEnglish = (
  job: '개발자' | '디자이너' | '기획자' | '그 외',
): 'developer' | 'designer' | 'planner' | 'etc' => {
  if (job === '개발자') {
    return 'developer';
  } else if (job === '디자이너') {
    return 'designer';
  } else if (job === '기획자') {
    return 'planner';
  } else {
    return 'etc';
  }
};

export const d2TMapper_getPostsResponse_Post = (dto: DTO.GetPostsResponse): Array<Type.Post> => {
  return dto.map<Type.Post>((post) => ({
    id: post.id,
    title: post.title,
    postImg: post.postImg,
    createdDt: post.createdDt,
    updatedDt: post.updatedDt,
    writer: post.writer,
    content: post.content,
    jobs: post.jobs.map((job) => jobNameKorean2JobNameEnglish(job.name)),
    applicants: post.applicants,
    recruiting: post.recruiting,
  }));
};