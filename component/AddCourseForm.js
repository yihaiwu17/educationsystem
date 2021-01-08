import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Input, Select, DatePicker, InputNumber, Upload } from 'antd';
import { teachersApi, courseTypeApi } from '../services/apiService';
import { getTime } from 'date-fns';
import NumberWithUni from '../component/NumberWithUnit';
import TextArea from 'antd/lib/input/TextArea';
import ImgCrop from 'antd-img-crop';

const DurationUnit = ['hour', 'day', 'week', 'month', 'year'];

export default function AddCourseForm() {
  const [teachers, setTeachers] = useState([]);
  const [courseType, setCourseType] = useState([]);
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  const { Dragger } = Upload;

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };


  useEffect(() => {
    courseTypeApi().then((res) => {
      const courseType = res.data.data.courseType;
      setCourseType(courseType);
    });
  }, []);

  return (
    <>
      <Form labelCol={{ offset: 1 }} wrapperCol={{ offset: 1 }} layout="vertical">
        <Row>
          <Col span={8}>
            <Form.Item
              label="Course Name"
              name="course name"
              rules={[{ required: true }, { max: 100, min: 3 }]}
            >
              <Input type="text" placeholder="course name"></Input>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Row>
              <Col span={8}>
                <Form.Item label="Teacher" name="TeacherId" rules={[{ required: true }]}>
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
                  <Input type="text" placeholder="course code" disabled />
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
              ></DatePicker>
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

            <Form.Item label="Duration" name="duration" rules={[{ required: true }]}>
              <NumberWithUni
                options={new Array(5)
                  .fill('')
                  .map((_, index) => ({ unit: index + 1, label: DurationUnit[index] }))}
                defaultUnit={DurationUnit.month}
              ></NumberWithUni>
            </Form.Item>
          </Col>

          <Col span={8} style={{ position: 'relative' }}>
            <Form.Item
              label="Description"
              name="detail"
              rules={[
                { required: true },
                { min: 100, max: 1000, message: 'Description must between 100 and 1000' },
              ]}
            >
              <TextArea placeholder="Course description" style={{ height: '100%' }}></TextArea>
            </Form.Item>
            <Col span={8} style={{ position: 'relative' }}>
              <Form.Item label="Cover" name="cover">
                <ImgCrop rotate aspect={16 / 9}>
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                  >
                    {fileList.length < 5 && '+ Upload'}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
          </Col>
        </Row>
      </Form>
    </>
  );
}
