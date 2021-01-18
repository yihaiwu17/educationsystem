import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Select, InputNumber, Upload, Button, Modal } from 'antd';
import {
  teachersApi,
  courseTypeApi,
  courseCodeApi,
  addCourseApi,
  updateCourseApi,
} from '../services/apiService';
import { getTime, format } from 'date-fns';
import Form from 'antd/lib/form';
import DatePicker from '../component/datePicker';
import { useForm } from 'antd/lib/form/Form';
import NumberWithUni from '../component/NumberWithUnit';
import TextArea from 'antd/lib/input/TextArea';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined, CloseCircleOutlined, KeyOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const DurationUnit = ['hour', 'day', 'week', 'month', 'year'];

const DescriptionTextArea = styled(Form.Item)`
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }
  .ant-row,
  .ant-form-item,
  .ant-form-item-control-input,
  .ant-form-item-control-input-content,
  text-area {
    height: 100%;
  }
`;

const UploadItem = styled(Form.Item)`
  .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    margin: 0;
  }
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-form-item-control-input div {
    height: 100%;
  }
  .ant-upload-picture-card-wrapper img {
    object-fit: cover !important;
  }
  .ant-upload-list-item-progress,
  .ant-tooltip {
    height: auto !important;
    .ant-tooltip-arrow {
      height: 13px;
    }
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
  }
  .ant-upload-list-item-actions {
    .anticon-delete {
      color: red;
    }
  }
`;

const UploadInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(240, 240, 240);
  width: 100%;
  .anticon {
    font-size: 44px;
    color: #1890ff;
  }
  p {
    font-size: 24px;
    color: #999;
  }
`;

const DeleteIcon = styled(CloseCircleOutlined)`
  color: red;
  position: absolute;
  right: -10px;
  top: 1em;
  font-size: 24px;
  opacity: 0.5;
`;

const validateDuration = (_, value) => {
  if (value.number > 0) {
    return Promise.resolve();
  }

  return Promise.reject('Duration must be greater than zero!');
};

export default function AddCourseForm({ course, onSuccess }) {
  const [form] = useForm();
  const [teachers, setTeachers] = useState([]);
  const [courseType, setCourseType] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isAdd, setIsAdd] = useState(course === undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [showCode, setShowCode] = useState(true);

  const onChange = ({ fileList: newFileList, file }) => {
    const { status } = file;

    if (file?.response) {
      const { url } = file.response;

      form.setFieldsValue({ cover: url });
    } else {
      form.setFieldsValue({ cover: course?.cover || '' });
    }

    setIsUploading(status === 'uploading');
    setFileList(newFileList);

    // setIsUploading(file.status === 'uploading');
    // setFileList(newFileList);
    // console.log(file)
    // if(file.status === 'done'){
    //   form.setFieldsValue({cover:file.response.url})
    // }
  };

  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
    setPreview({
      previewImage: file.url || file.preview,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
    // const image = new Image();
    // image.src = file.url;
    // const imgWindow = window.open(src);
    // imgWindow.document.write(image.outerHTML);
  };

  useEffect(() => {
    if (isAdd) {
      courseCodeApi().then((res) => {
        const courseCodes = res.data.data.courseCode;
        form.setFieldsValue({ uid: [courseCodes] });
        setShowCode(false);
      });
    }
    courseTypeApi().then((res) => {
      const courseType = res.data.data.courseType;
      setCourseType(courseType);
    });
  }, []);

  const onFinish = async (values) => {
    // if (!isEdit && !course) {
    //   message.error('You must select a course to update!');
    //   return;
    // }

    const req = {
      ...values,
      duration: values.duration.number,
      typeId: values.typeId,
      startTime: format(values.startTime, 'yyy-MM-dd'),
      teacherId: values.teacherId || course.teacherId,
      durationUnit: values.duration.unit,
    };

    const response = isAdd ? addCourseApi(req) : updateCourseApi({ ...req, id: course.id });

    const { data } = await response;

    if (!!data && !course) {
      setIsAdd(false);
    }

    if (!!onSuccess && !!data) {
      onSuccess(data.data);
    }
  };

  useEffect(() => {
    if (!!course) {
      const values = {
        ...course,
        typeId: String(course.typeId),
        teacherId: course.teacherName,
        startTime: new Date(course.startTime),
        duration: { number: course.duration, unit: course.durationUnit },
      };

      form.setFieldsValue(values);

      setFileList([{ name: 'Cover Image', url: course.cover }]);
    }
  }, [course]);

  return (
    <>
      <Form
        labelCol={{ offset: 1 }}
        wrapperCol={{ offset: 1 }}
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Row>
          <Col span={8}>
            <Form.Item
              label="Course Name"
              name="name"
              rules={[
                { required: true },
                { max: 100, min: 3, message: 'Course name length must between 3-100 characters' },
              ]}
            >
              <Input type="text" placeholder="course name"></Input>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Row>
              <Col span={8}>
                <Form.Item label="Teacher" name="teacherId" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select teacher"
                    filterOption={false}
                    showSearch
                    onSearch={(query) => {
                      teachersApi({ query }).then((res) => {
                        const { data } = res;
                        setTeachers(data.data.teacherInfo);
                      });
                    }}
                  >
                    {teachers.map(({ name, id }) => (
                      <Select.Option key={id} value={id}>
                        {name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Type" name="typeId" rules={[{ required: true }]}>
                  <Select>
                    {courseType.map((type) => (
                      <Select.Option value={type.id} key={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Course Code" name="uid" rules={[{ required: true }]}>
                  <Input
                    disabled
                    type="text"
                    placeholder="course code"
                    addonAfter={showCode ? <KeyOutlined style={{ cursor: 'pointer' }} /> : null}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item label="Start Date" name="startTime">
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(current) => {
                  const today = getTime(new Date());
                  const date = current.valueOf();

                  return today > date;
                }}
              />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
              <InputNumber
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                style={{ width: '100%' }}
              ></InputNumber>
            </Form.Item>

            <Form.Item label="Student Limit" name="maxStudents" rules={[{ required: true }]}>
              <InputNumber min={1} max={10} style={{ width: '100%' }}></InputNumber>
            </Form.Item>

            <Form.Item
              label="Duration"
              name="duration"
              rules={[{ required: true }, { validator: validateDuration }]}
            >
              <NumberWithUni
                options={new Array(5)
                  .fill('')
                  .map((_, index) => ({ unit: index + 1, label: DurationUnit[index] }))}
                defaultUnit={DurationUnit[3]}
              ></NumberWithUni>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Row style={{ marginLeft: '-10px', height: '100%' }}>
              <Col span={12} style={{ position: 'relative' }}>
                <DescriptionTextArea
                  label="Description"
                  name="detail"
                  rules={[
                    { required: true },
                    { min: 100, max: 1000, message: 'Description must between 100 and 1000' },
                  ]}
                >
                  <TextArea placeholder="Course description" style={{ height: '100%' }}></TextArea>
                </DescriptionTextArea>
              </Col>
              <Col span={12} style={{ position: 'relative' }}>
                <UploadItem label="Cover" name="cover" style={{ height: '100%' }}>
                  <ImgCrop rotate aspect={16 / 9}>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                    >
                      {fileList.length >= 1 ? null : (
                        <UploadInner>
                          <InboxOutlined></InboxOutlined>
                          <p>Click or drag file to this area to upload</p>
                        </UploadInner>
                      )}
                    </Upload>
                  </ImgCrop>
                </UploadItem>
                {isUploading && (
                  <DeleteIcon
                    onClick={() => {
                      setIsUploading(false);
                      setFileList([]);
                    }}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isUploading}>
                {isAdd ? 'Create Course' : 'Update Course'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Modal
        visible={!!preview}
        title={preview?.previewTitle}
        footer={null}
        onCancel={() => setPreview(null)}
      >
        <img alt="example" style={{ width: '100%' }} src={preview?.previewImage} />
      </Modal>
    </>
  );
}
