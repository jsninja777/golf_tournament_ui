import React, { useEffect, useState } from 'react'
import { Table, Typography, Space, Row, Col, Modal, Button, Form, Input, DatePicker } from 'antd';
import { useNavigate } from "react-router-dom";
import HttpClient from '../../services/HttpClient'
import headCells from './fields';
  
const Tournament = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { Title } = Typography;

  useEffect(() => {
    HttpClient.get(`/tournaments.json`)
      .then(res => {
        setTournaments(res);
      })
      .catch(error => {
      })
  }, [])

  const handleClick = (id) => {
    navigate("/tournament/"+id);
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onFinish = (values) => {
    HttpClient.post(`/tournaments.json?tournament[name]=${values.name}&tournament[course]=${values.course}&tournament[start_date]=${values.start_date}`)
    .then(res => {
      setTournaments([...tournaments, res])
      setIsModalVisible(false);
    })
    .catch(error => {
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearch = (event) => {
    HttpClient.get(`/tournaments.json`)
    .then(res => {
      if (event._d !== null) {
        setTournaments(
          res.filter(
            (obj) =>{
              return obj.start_date === convertDate(event._d)
            }
          )
        )
      }
    })
    .catch(error => {
    })
  }

  const convertDate = (sDate) => {
    let month = ("0" + (sDate.getUTCMonth() + 1)).slice(-2)
    let day =  ("0" + (sDate.getUTCDate() + 1)).slice(-2)
    let year = sDate.getUTCFullYear();
    return year + "-" + month + "-" + day;
  }

  return (
    <div className="space-align-block">
      <Row>
        <Col span={17}>
          <Typography>
            <Title level={3}>Tournaments</Title>
          </Typography>
        </Col>
        <Col span={4}>
          <Space direction="vertical">
            <DatePicker onChange={onSearch} />
          </Space>
        </Col>
        <Col span={3}>
          <Button
            style={{
              float: 'right'
            }}
            type="primary"
            onClick={showModal}
          >
            Add Tournament
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={tournaments}
        columns={headCells}
        bordered
        rowKey="id"
        onRow={(record, rowIndex) => {
          return {
            onClick: event => handleClick(record.id)
          };
        }}
        className="clickable-pointer"
      />
      <Modal title="Add New Tournament" closable={false} visible={isModalVisible} cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ style: { display: 'none' } }}>
        <Row>
          <Col span={18}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter tournament name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Course"
                name="course"
                rules={[{ required: true, message: 'Please enter tournament course!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Start Date"
                name="start_date"
                rules={[{ required: true, message: 'Please enter tournament start date!' }]}
              >
                <DatePicker/>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 13, span: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    float: 'right'
                  }}
                >
                  Submit
                </Button>
                <Button
                  htmlType="button"   
                  onClick={handleCancel}       
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default Tournament;
