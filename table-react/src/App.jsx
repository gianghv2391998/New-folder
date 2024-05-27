import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // Khởi tạo state cho danh sách bài viết, lượt xem, tiêu đề và bài viết đang chỉnh sửa
  const [posts, setPosts] = useState([]) // Danh sách bài viết
  const [views, setViews] = useState('') // Số lượt xem
  const [title, setTitle] = useState('') // Tiêu đề
  const [currentEdit, setCurrentEdit] = useState({}) // Bài viết đang chỉnh sửa

  // Hàm lấy danh sách bài viết từ server
  const getPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/posts')
      setPosts(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  // Hàm thêm bài viết mới
  const addPost = async () => {
    try {
      //[1,2,3]
      //Math.max(...[1,2,3]) = Math.max(1,2,3)
      // Tìm ID lớn nhất hiện tại
      const maxId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) : 0
      // Tạo ID mới bằng cách tăng ID lớn nhất lên 1
      const newId = maxId + 1
      // Tạo đối tượng formData để gửi lên server
      const formData = {
        id: newId, // Gán ID mới
        views: views,
        title: title
      }
      // Gửi request POST lên server
      await axios.post('http://localhost:3000/posts', formData)
      // Lấy lại danh sách bài viết từ server
      getPosts()
      setTitle('')
      setViews('')
    } catch (error) {
      console.error(error)
    }
  }

  // Hàm cập nhật bài viết
  const handleUpdatePost = async (formData) => {
    try {
      // Gửi request PUT lên server để cập nhật bài viết
      await axios.put(`http://localhost:3000/posts/${formData.id}`, formData)
      // Lấy lại danh sách bài viết sau khi cập nhật
      getPosts()
      // Đặt lại state `currentEdit` để kết thúc chế độ chỉnh sửa
      setCurrentEdit({})
    } catch (error) {
      console.error(error)
    }
  }

  // Hàm xóa bài viết
  const deletePost = async (id) => {
    try {
      // Gửi request DELETE lên server để xóa bài viết
      await axios.delete(`http://localhost:3000/posts/${id}`)
      // Lấy lại danh sách bài viết từ server
      getPosts()
    } catch (error) {
      console.error(error)
    }
  }

  // Hàm xử lý thay đổi khi chỉnh sửa bài viết
  const handleEditChange = (e) => {
    const { name, value } = e.target
    // Cập nhật giá trị của bài viết đang chỉnh sửa
    setCurrentEdit(prev => ({ ...prev, [name]: value }))
  }

  // Hook useEffect được sử dụng để gọi hàm getPosts() khi component được render
  useEffect(() => {
    getPosts()
  }, [])

  // Trả về JSX
  return (
    <>

      {/* Input để nhập số lượt xem */}
      <input type="number" placeholder='Enter Views' value={views} onChange={(e) => setViews(e.target.value)} />
      {/* Input để nhập tiêu đề */}
      <input type="text" placeholder='Enter Title' value={title} onChange={(e) => setTitle(e.target.value)} />
      {/* Button để thêm bài viết mới */}
      <button onClick={addPost}>Add</button>

      {/* Bảng hiển thị danh sách bài viết */}
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>views</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping qua danh sách bài viết và hiển thị từng bài viết */}
          {
            (posts || []).map((post) => (
              <tr key={post.id}>
                {
                  // Nếu bài viết đang được chỉnh sửa, hiển thị input để chỉnh sửa
                  post.id === currentEdit.id ?
                    <>
                      {/* Hiển thị ID và input để chỉnh sửa tiêu đề */}
                      <td>{currentEdit.id}</td>
                      <td>
                        <input
                          type="text"
                          name="title"
                          value={currentEdit.title}
                          onChange={handleEditChange}
                        />
                      </td>
                      {/* Hiển thị input để chỉnh sửa số lượt xem */}
                      <td>
                        <input
                          type="number"
                          name="views"
                          value={currentEdit.views}
                          onChange={handleEditChange}
                        />
                      </td>
                    </>
                    :
                    // Nếu không, hiển thị thông tin bài viết
                    <>
                      {/* Hiển thị ID, tiêu đề và số lượt xem */}
                      <td>{post.id}</td>
                      <td>{post.title}</td>
                      <td>{post.views}</td>
                    </>
                }
                {/* Button để xóa, chỉnh sửa và lưu bài viết */}
                <td>
                  <button onClick={() => deletePost(post.id)}>Delete</button>
                  <button onClick={() => setCurrentEdit(post)}>Edit</button>
                  {/* Nút Save để lưu các thay đổi khi chỉnh sửa */}
                  <button onClick={() => handleUpdatePost(currentEdit)}>Save</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  )
}

export default App