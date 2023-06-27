from app.extension import db

# table database task
class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(1024))
    status = db.Column(db.Boolean, default = False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('Users', back_populates = 'tasks')

    # fungsi serialize untuk mengembalikan data dictionary
    def serialize(self): 
        return {
            "id": self.id,
            "title": self.title,
            "description":self.description,
            "status": self.status,
            "user_id":self.user_id
        }
