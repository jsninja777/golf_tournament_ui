import React, { useEffect, useState } from 'react'
import { Table, Typography, Button, Row, Col, Modal, Select } from 'antd';
import { isEmpty } from 'lodash/fp';
import HttpClient from '../../services/HttpClient'
import { useParams } from 'react-router-dom';
import { Sorter } from "../../utils/sorter";

const TournamentShow = () => {
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

  const { id } = useParams();
  const [tournament, setTournament] = useState({});
  const [players, setPlayers] = useState([]);
  const [playerOptions, setPlayerOptions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { Title } = Typography;
  const [ playerId, setPlayerId] = useState();
  const [confirmation, setConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    if (id) {
      HttpClient.get(`/tournaments/${id}.json`)
        .then(res => {
          setTournament(res);
        })
        .catch(error => {
        })
    }
  }, [id])

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
    removeExistingObjects();
  };

  const AddPlayer = () => {
    HttpClient.post(`/tournaments/${id}/add/${playerId}.json`)
    .then(res => {
      setTournament(res);
      setIsModalVisible(false);
    })
    .catch(error => {
    })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setConfirmation(false);
  };

  const handleChange = (value) => {
    setPlayerId(value);
  }

  const removeExistingObjects = () => {
    if (players && tournament.players) {
      let restPlayers = players.filter(ar => !tournament.players.find(rm => (rm.name === ar.name && ar.place === rm.place) ))
      setPlayerOptions(restPlayers)
    }
  }

  const onDelete = (record, event) => {
    HttpClient.delete(`/tournaments/${id}/remove/${deleteId}.json`)
    .then(res => {
      setTournament(res);
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
            <Title level={3}>{tournament.name}</Title>
          </Typography>
        </Col>
        <Col span={12}>
          {!isEmpty(players) &&
            <Button
              style={{
                float: 'right'
              }}
              type="primary"
              onClick={showModal}
            >
              Add Player
            </Button>
          }
        </Col>
      </Row>
      <Table
        dataSource={tournament.players}
        columns={headCells}
        bordered
        rowKey="id"
      />
      <Modal title="Add Player" visible={isModalVisible} onOk={AddPlayer} onCancel={handleCancel} okText="Submit">
        <Select
          showSearch
          style={{ width: 480 }}
          placeholder="Search to Select"
          optionFilterProp="children"
          onChange={handleChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          filterSort={(optionA, optionB) =>
            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
          }
        >
          {playerOptions && playerOptions.map(player =>
            <option key={player.id} value={player.id}>{player.name}</option>
          )};
        </Select>
      </Modal>
      <Modal title="Confirmation" visible={confirmation} onOk={onDelete} onCancel={handleCancel}>
        <p>Are you sure want to delete this record?</p>
      </Modal>
    </div>
  );
};

export default TournamentShow;
