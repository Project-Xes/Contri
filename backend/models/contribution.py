from backend.extensions import db
from backend.models import BaseModel


class Contribution(BaseModel):
    __tablename__ = "contributions"
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    file_url = db.Column(db.String(500))
    ipfs_cid = db.Column(db.String(128))
    ipfs_file_size = db.Column(db.Integer, nullable=True)  # File size in bytes
    ipfs_pin_timestamp = db.Column(db.String(50), nullable=True)  # ISO timestamp
    reward_amount = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(50), default="Pending")

    author = db.relationship("User", backref="contributions")

    def to_card(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "description": (self.description or "")[:160],
            "contributor": self.author.email,
            "cid": self.ipfs_cid or "",
            "rewardStatus": "Claimable" if self.reward_amount else "Pending",
            "citations": 0,
            "rewardAmount": f"{self.reward_amount:.2f}",
            "status": self.status,
            "author": self.author.to_dict(),
            "ipfs_cid": self.ipfs_cid,
            "ipfs_file_size": self.ipfs_file_size,
            "ipfs_pin_timestamp": self.ipfs_pin_timestamp,
            "fileUrl": self.file_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def to_detail(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "fileUrl": self.file_url,
            "ipfsCID": self.ipfs_cid,
            "ipfsFileSize": self.ipfs_file_size,
            "ipfsPinTimestamp": self.ipfs_pin_timestamp,
            "rewardAmount": self.reward_amount,
            "status": self.status,
            "author": self.author.to_dict(),
        }


