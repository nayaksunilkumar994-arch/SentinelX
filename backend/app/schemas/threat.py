from pydantic import BaseModel
from typing import List, Optional


class IPLookupResponse(BaseModel):
    ip: str
    city: Optional[str] = None
    region: Optional[str] = None
    country: Optional[str] = None
    location: Optional[str] = None
    organization: Optional[str] = None
    timezone: Optional[str] = None


class DNSLookupResponse(BaseModel):
    domain: str
    addresses: List[str]


class WhoisResponse(BaseModel):
    domain: str
    registrar: Optional[str] = None
    creation_date: Optional[str] = None
    expiration_date: Optional[str] = None