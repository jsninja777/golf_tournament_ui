import React, { useEffect, useState } from 'react'
import { Table, Typography, Button, Row, Col, Modal, Form, Input, Checkbox } from 'antd';
import HttpClient from '../../services/HttpClient'
import { Sorter } from "../../utils/sorter";
  
const Player = () => {
  const headCells = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) =>
          Sorter.DEFAULT(a.name, b.name),
      },
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: {
        compare: (a, b) =>
          Sorter.DEFAULT(a.name, b.name),
      },
    },
    {
      title: 'Handicap',
      dataIndex: 'handicap',
      key: 'handicap',
      render : (text) => String(text ? 'Yes' : 'No'),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => (
        <span
          className='link'
          onClick={(e) => { setConfirmation(true);setDeleteId(record.id); }}
        >
          Delete
        </span>
      ),
    },
  ];

  const [players, setPlayers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const { Title } = Typography;

  useEffect(() => {
    HttpClient.get(`/players.json`)
      .then(res => {
        setPlayers(res);
      })
      .catch(error => {
      })
  }, [])

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onFinish = (values) => {
    HttpClient.post(`/players.json?player[name]=${values.name}&player[location]=${values.location}&player[handicap]=${values.handicap}`)
    .then(res => {
      setPlayers([...players, res])
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
    setConfirmation(false);
  };

  const getElement = (array) => {
    return array.find((element) => {
      return element.id === deleteId;
    })
  }

  const spliceElement = () => {
    let array = [...players];
    let ele = getElement(array);
    let index = array.indexOf(ele);
    if (index !== -1) {
      array.splice(index, 1);
      setPlayers(array);
    }
  } 

  const onDelete = () => {
    HttpClient.delete(`/players/${deleteId}.json`)
    .then(res => {
      spliceElement();
      setConfirmation(false);
    })
    .catch(error => {
    })
  }

  return (
    <div className="space-align-block">
      <Row>
        <Col span={12}>
          <Typography>
            <Title level={3}>Players</Title>
          </Typography>
        </Col>
        <Col span={12}>
          <Button
            style={{
              float: 'right'
            }}
            type="primary"
            onClick={showModal}
          >
            Add Player
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={players}
        columns={headCells}
        bordered
        rowKey="id"
      />
      <Modal title="Add New Player" closable={false} visible={isModalVisible} cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ style: { display: 'none' } }}>
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
                rules={[{ required: true, message: 'Please enter player name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Please enter player location!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="handicap" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Handicap</Checkbox>
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
      <Modal title="Confirmation" visible={confirmation} onOk={onDelete} onCancel={handleCancel}>
        <p>Are you sure want to delete this record?</p>
      </Modal>
    </div>
  );
}

export default Player;

