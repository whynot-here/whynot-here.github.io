import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import type * as PostAction from '../../../domains/post/post.action';
import { useCreatePost } from '../../../domains/post/post.api';

import Modal from '../../Modal';

import * as Styled from './WritingModal.styled';

import { RoutePath } from '../../../RoutePath';

type WritingModalProps = {
  onHide: () => void;
};

const WritingModal = (props: WritingModalProps) => {
  const { onHide } = props;
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, setValue } = useForm<PostAction.CreatePostCommand>();
  const [ids, setIds] = useState<Array<number>>();
  const { mutateAsync: mutateCreatePost, isLoading, isError } = useCreatePost();

  // TODO: 이미지 동적으로 바꿀 수 있도록 하기
  setValue(
    'postImg',
    'https://user-images.githubusercontent.com/40762111/162617063-06791489-73a0-4249-9c4d-a9b515449a2a.png',
  );

  const handleFilter = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!(event.target instanceof HTMLButtonElement)) {
        return;
      }

      const id = Number(event.target.dataset.id);
      const jobIds = getValues('jobIds');

      if (!!jobIds) {
        if (jobIds.includes(id)) {
          setValue('jobIds', [...jobIds].filter((jobId) => jobId !== id).sort());
        } else {
          setValue('jobIds', [...jobIds, id].sort());
        }
      } else {
        setValue('jobIds', [id]);
      }
      setIds(getValues('jobIds'));
    },
    [getValues, setValue],
  );

  // TODO: react-hook-form의 isDirty 적용하기
  const handleWriting = useCallback(
    async (formData: PostAction.CreatePostCommand) => {
      try {
        await mutateCreatePost(formData);

        navigate(RoutePath.HOME);
      } catch (error) {
        alert('다시 시도해 주세요.');
      }
      onHide();
    },
    [mutateCreatePost, navigate, onHide],
  );

  return isLoading ? (
    <div>Loading...</div>
  ) : isError ? (
    <div>Error</div>
  ) : (
    <Modal title="글쓰기" submitTitle="등록" onHide={onHide} onSubmit={handleSubmit(handleWriting)}>
      {/* TODO: 여기 아래를 컴포넌트로 분리 */}
      <Styled.FilterContainer>
        <Styled.FilterTitle>모집</Styled.FilterTitle>
        <Styled.Button
          type="button"
          $type={ids?.includes(1) ? 'contained' : 'text'}
          data-id="1"
          onClick={handleFilter}
        >
          개발자
        </Styled.Button>
        <Styled.Button
          type="button"
          $type={ids?.includes(2) ? 'contained' : 'text'}
          data-id="2"
          onClick={handleFilter}
        >
          디자이너
        </Styled.Button>
        <Styled.Button
          type="button"
          $type={ids?.includes(3) ? 'contained' : 'text'}
          data-id="3"
          onClick={handleFilter}
        >
          기획자
        </Styled.Button>
        <Styled.Button
          type="button"
          $type={ids?.includes(4) ? 'contained' : 'text'}
          data-id="4"
          onClick={handleFilter}
        >
          기타
        </Styled.Button>
      </Styled.FilterContainer>
      <Styled.ContentContainer>
        <Styled.TitleInput {...register('title')} placeholder="제목을 입력해 주세요." />
        <Styled.Divider />
        <Styled.TextArea
          {...register('content')}
          placeholder="연락처나 오픈 채팅방 주소를 알려주세요."
        />
      </Styled.ContentContainer>
      <Styled.Footer>
        <Styled.ImageIcon />
      </Styled.Footer>
    </Modal>
  );
};

export default WritingModal;
