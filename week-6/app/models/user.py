from app.extension import db

# table database user
class Users(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(64))
    email = db.Column(db.String(128))
    password = db.Column(db.String(1024))
    tasks = db.relationship('Tasks', back_populates='user')

    # fungsi serialize untuk mengembalikan data dictionary
    def serialize(self): 
        return {
            "id": self.id,
            "name": self.name,
            "email":self.email
        }
